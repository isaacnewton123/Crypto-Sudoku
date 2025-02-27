// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256);
}

contract Sudoku_Leaderboard_Optimized {
    struct Score {
        address player;
        uint32 time;       // Waktu dalam detik (uint32 cukup untuk 136 tahun)
        uint8 mistakes;    // Jumlah kesalahan (uint8 cukup untuk 0-255)
        uint32 points;     // Poin yang dihitung (uint32 cukup untuk poin realistis)
        uint32 timestamp;  // Waktu submit (uint32 cukup sampai tahun 2106)
    }

    struct SeasonInfo {
        uint32 startTime;  // Pakai uint32 untuk menghemat gas
        uint32 endTime;    // Pakai uint32 untuk menghemat gas
        bool isActive;
        uint16 scoreCount; // uint16 cukup untuk 65535 skor
        mapping(uint16 => Score) scores;
    }

    mapping(uint16 => SeasonInfo) public seasons;
    mapping(bytes32 => bool) private usedSignatures;
    
    uint16 public currentSeason;
    uint32 public constant SEASON_DURATION = 30 days;
    uint16 public constant MAX_SCORES_PER_SEASON = 100;
    uint32 public constant GRACE_PERIOD = 1 days;
    
    address public owner;
    address public automationContract;
    address private verifierAddress;
    bool public isPaused;
    IERC721 public nftContract;

    // Konstanta untuk penghitungan poin
    uint16 public constant MAX_TIME = 7200;           // Maksimal waktu: 2 jam dalam detik
    uint8 public constant MAX_MISTAKES = 9;           // Maksimal kesalahan: 9
    uint16 public constant MISTAKE_PENALTY = 100;     // Poin penalty per kesalahan
    
    // Konstanta untuk paginasi
    uint8 public constant SCORES_PER_PAGE = 20;      // Jumlah skor per halaman untuk fungsi paginasi

    event NewScore(uint16 indexed season, address indexed player, uint32 time, uint8 mistakes, uint32 points, uint32 timestamp);
    event NewSeasonStarted(uint16 indexed season, uint32 startTime, uint32 endTime);
    event SeasonEnded(uint16 indexed season, uint32 endTime);
    event ContractPaused(bool isPaused);
    event AutomationContractUpdated(address newContract);
    event NFTContractUpdated(address newContract);
    event ScoreSubmissionRejected(address indexed player, string reason);
    event TopScoreUpdated(uint16 indexed season, uint16 rank, address player, uint32 points);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAutomation() {
        require(
            msg.sender == automationContract || msg.sender == owner,
            "Only automation or owner can call this function"
        );
        _;
    }

    modifier whenNotPaused() {
        require(!isPaused, "Contract is paused");
        _;
    }

    constructor(address _verifierAddress) {
        require(_verifierAddress != address(0), "Invalid verifier address");
        nftContract = IERC721(NFT_ADDRESS);
        owner = msg.sender;
        verifierAddress = _verifierAddress;
        _startNewSeason();
    }

    function _startNewSeason() internal {
        currentSeason++;
        uint32 startTime = uint32(block.timestamp);
        uint32 endTime = startTime + SEASON_DURATION;
        
        SeasonInfo storage newSeason = seasons[currentSeason];
        newSeason.startTime = startTime;
        newSeason.endTime = endTime;
        newSeason.isActive = true;
        newSeason.scoreCount = 0;

        emit NewSeasonStarted(currentSeason, startTime, endTime);
    }

    function calculatePoints(uint32 _timeSeconds, uint8 _mistakes) public pure returns (uint32) {
        // Validasi input
        require(_timeSeconds <= MAX_TIME, "Time exceeds maximum allowed");
        require(_mistakes <= MAX_MISTAKES, "Mistakes exceed maximum allowed");
        
        // Poin dari waktu: setiap detik penghematan = 1 poin
        uint32 timePoints = MAX_TIME - _timeSeconds;
        
        // Poin penalty dari kesalahan: setiap kesalahan = MISTAKE_PENALTY poin
        uint32 mistakePenalty = uint32(_mistakes) * MISTAKE_PENALTY;
        
        // Total poin
        if (mistakePenalty >= timePoints) {
            return 0; // Minimum points
        }
        
        return timePoints - mistakePenalty;
    }

    function verifySignature(
        uint32 _timeSeconds,
        uint8 _mistakes,
        bytes32 _puzzleHash,
        bytes memory _signature
    ) private view returns (bool) {
        bytes32 messageHash = keccak256(
            abi.encodePacked(_timeSeconds, _mistakes, _puzzleHash, msg.sender)
        );
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        
        address recoveredSigner = recoverSigner(ethSignedMessageHash, _signature);
        return recoveredSigner == verifierAddress;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) 
        private 
        pure 
        returns (address) 
    {
        require(_signature.length == 65, "Invalid signature length");
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }
        
        if (v < 27) {
            v += 27;
        }
        
        require(v == 27 || v == 28, "Invalid signature recovery value");
        
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function checkAndUpdateSeason() public {
        SeasonInfo storage season = seasons[currentSeason];
        
        if (block.timestamp >= season.endTime + GRACE_PERIOD && season.isActive) {
            season.isActive = false;
            emit SeasonEnded(currentSeason, uint32(block.timestamp));
            _startNewSeason();
        }
    }

    function addScore(
        uint32 _timeSeconds,
        uint8 _mistakes,
        bytes32 _puzzleHash,
        bytes memory _signature
    ) external whenNotPaused {
        // Check NFT ownership
        require(nftContract.balanceOf(msg.sender) > 0, "Must own NFT to submit score");
        
        // Validasi input
        require(_timeSeconds > 0 && _timeSeconds <= MAX_TIME, "Invalid time");
        require(_mistakes <= MAX_MISTAKES, "Too many mistakes");
        
        // Verify signature
        bytes32 sigHash = keccak256(_signature);
        require(!usedSignatures[sigHash], "Signature already used");
        require(
            verifySignature(_timeSeconds, _mistakes, _puzzleHash, _signature),
            "Invalid signature"
        );
        
        checkAndUpdateSeason();
        
        SeasonInfo storage season = seasons[currentSeason];
        require(season.isActive, "Current season is not active");
        require(block.timestamp <= season.endTime, "Season has ended");
        
        // Calculate points
        uint32 points = calculatePoints(_timeSeconds, _mistakes);
        
        // Mark signature as used
        usedSignatures[sigHash] = true;
        
        // Optimize: only process if score is good enough to be in top MAX_SCORES_PER_SEASON
        if (season.scoreCount < MAX_SCORES_PER_SEASON) {
            _insertScore(season, _timeSeconds, _mistakes, points);
            
        } else {
            // Check if score is better than worst score
            Score storage worstScore = season.scores[season.scoreCount - 1];
            if (points > worstScore.points) {
                _insertScore(season, _timeSeconds, _mistakes, points);
            } else {
                emit ScoreSubmissionRejected(msg.sender, "Score not high enough for top 100 leaderboard");
            }
        }
    }

    // Fungsi internal untuk mengoptimasi penyisipan skor
    function _insertScore(
        SeasonInfo storage season, 
        uint32 _timeSeconds,
        uint8 _mistakes,
        uint32 points
    ) private {
        uint16 insertIndex = season.scoreCount;
        
        // Find correct position for the new score
        for(uint16 i = 0; i < season.scoreCount; i++) {
            if(points > season.scores[i].points) {
                insertIndex = i;
                break;
            }
        }
        
        // Shift scores if needed
        if(insertIndex < season.scoreCount) {
            for(uint16 i = season.scoreCount; i > insertIndex; i--) {
                if(i < MAX_SCORES_PER_SEASON) {
                    season.scores[i] = season.scores[i-1];
                }
            }
        }
        
        // Insert new score
        season.scores[insertIndex] = Score({
            player: msg.sender,
            time: _timeSeconds,
            mistakes: _mistakes,
            points: points,
            timestamp: uint32(block.timestamp)
        });
        
        // Increment score count if needed
        if(season.scoreCount < MAX_SCORES_PER_SEASON) {
            season.scoreCount++;
        }
        
        emit NewScore(currentSeason, msg.sender, _timeSeconds, _mistakes, points, uint32(block.timestamp));
        emit TopScoreUpdated(currentSeason, insertIndex + 1, msg.sender, points);
    }

    // Fungsi untuk mendapatkan seluruh atau sebagian dari skor top.
    function getSeasonTopScores(uint16 _season, uint16 _limit) external view returns (
        address[] memory players,
        uint32[] memory times,
        uint8[] memory mistakes,
        uint32[] memory points,
        uint32[] memory timestamps
    ) {
        require(_season > 0 && _season <= currentSeason, "Invalid season");
        require(_limit > 0, "Invalid limit");
        
        // Jika _limit tidak disediakan atau terlalu besar, batasi ke MAX_SCORES_PER_SEASON
        if (_limit > MAX_SCORES_PER_SEASON) {
            _limit = MAX_SCORES_PER_SEASON;
        }
        
        SeasonInfo storage season = seasons[_season];
        uint16 count = season.scoreCount;
        uint16 length = _limit < count ? _limit : count;
        
        players = new address[](length);
        times = new uint32[](length);
        mistakes = new uint8[](length);
        points = new uint32[](length);
        timestamps = new uint32[](length);
        
        for(uint16 i = 0; i < length; i++) {
            Score storage score = season.scores[i];
            players[i] = score.player;
            times[i] = score.time;
            mistakes[i] = score.mistakes;
            points[i] = score.points;
            timestamps[i] = score.timestamp;
        }
    }

    // Fungsi untuk mendapatkan skor dengan paginasi
    function getSeasonScoresPaginated(uint16 _season, uint16 _page) external view returns (
        address[] memory players,
        uint32[] memory times, 
        uint8[] memory mistakes,
        uint32[] memory points,
        uint32[] memory timestamps
    ) {
        require(_season > 0 && _season <= currentSeason, "Invalid season");
        
        SeasonInfo storage season = seasons[_season];
        uint16 count = season.scoreCount;
        
        uint16 startIndex = _page * SCORES_PER_PAGE;
        if (startIndex >= count) {
            // Halaman kosong, kembalikan array kosong
            players = new address[](0);
            times = new uint32[](0);
            mistakes = new uint8[](0);
            points = new uint32[](0);
            timestamps = new uint32[](0);
            return (players, times, mistakes, points, timestamps);
        }
        
        uint16 endIndex = startIndex + SCORES_PER_PAGE;
        if (endIndex > count) {
            endIndex = count;
        }
        
        uint16 length = endIndex - startIndex;
        
        players = new address[](length);
        times = new uint32[](length);
        mistakes = new uint8[](length);
        points = new uint32[](length);
        timestamps = new uint32[](length);
        
        for (uint16 i = 0; i < length; i++) {
            Score storage score = season.scores[i + startIndex];
            players[i] = score.player;
            times[i] = score.time;
            mistakes[i] = score.mistakes;
            points[i] = score.points;
            timestamps[i] = score.timestamp;
        }
    }
    
    function getSeasonInfo(uint16 _season) external view returns (
        uint32 startTime,
        uint32 endTime,
        bool isActive,
        uint16 totalScores,
        bool hasEnded,
        uint16 maxScoresPerSeason
    ) {
        SeasonInfo storage season = seasons[_season];
        return (
            season.startTime,
            season.endTime,
            season.isActive,
            season.scoreCount,
            block.timestamp >= season.endTime + GRACE_PERIOD,
            MAX_SCORES_PER_SEASON
        );
    }

    // Admin functions
    function setVerifierAddress(address _newVerifier) external onlyOwner {
        require(_newVerifier != address(0), "Invalid verifier address");
        verifierAddress = _newVerifier;
    }

    function setAutomationContract(address _newContract) external onlyOwner {
        require(_newContract != address(0), "Invalid automation contract");
        automationContract = _newContract;
        emit AutomationContractUpdated(_newContract);
    }

    function automatedSeasonCheck() external onlyAutomation {
        checkAndUpdateSeason();
    }

    function togglePause() external onlyOwner {
        isPaused = !isPaused;
        emit ContractPaused(isPaused);
    }

    function forceEndCurrentSeason() external onlyOwner {
        SeasonInfo storage season = seasons[currentSeason];
        require(season.isActive, "Season already ended");
        season.isActive = false;
        season.endTime = uint32(block.timestamp);
        emit SeasonEnded(currentSeason, uint32(block.timestamp));
        _startNewSeason();
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        owner = newOwner;
    }
    
    function setNFTContract(address _newContract) external onlyOwner {
        require(_newContract != address(0), "Invalid NFT contract");
        nftContract = IERC721(_newContract);
        emit NFTContractUpdated(_newContract);
    }
}
