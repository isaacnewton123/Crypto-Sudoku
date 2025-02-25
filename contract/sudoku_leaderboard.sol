// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256);
}

contract Sudoku_Leaderboard {
    struct Score {
        address player;
        uint256 time;
        uint256 timestamp;
    }

    struct SeasonInfo {
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256 scoreCount;
        mapping(uint256 => Score) scores;
    }

    mapping(uint256 => SeasonInfo) public seasons;
    mapping(bytes32 => bool) private usedSignatures;
    
    uint256 public currentSeason;
    uint256 public constant SEASON_DURATION = 30 days;
    uint256 public constant MAX_SCORES_PER_SEASON = 10;
    uint256 public constant GRACE_PERIOD = 1 days;
    
    address public owner;
    address public automationContract;
    address private verifierAddress;
    bool public isPaused;
    IERC721 public nftContract;

    event NewScore(uint256 indexed season, address indexed player, uint256 time, uint256 timestamp);
    event NewSeasonStarted(uint256 indexed season, uint256 startTime, uint256 endTime);
    event SeasonEnded(uint256 indexed season, uint256 endTime);
    event ContractPaused(bool isPaused);
    event AutomationContractUpdated(address newContract);
    event NFTContractUpdated(address newContract);
    event ScoreSubmissionRejected(address indexed player, string reason);

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
        nftContract = IERC721(0x480c9ebAbA0860036C584ef70379dC82eFB151bf);
        owner = msg.sender;
        verifierAddress = _verifierAddress;
        _startNewSeason();
    }

    function _startNewSeason() internal {
        currentSeason++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + SEASON_DURATION;
        
        SeasonInfo storage newSeason = seasons[currentSeason];
        newSeason.startTime = startTime;
        newSeason.endTime = endTime;
        newSeason.isActive = true;
        newSeason.scoreCount = 0;

        emit NewSeasonStarted(currentSeason, startTime, endTime);
    }

    function verifySignature(
        uint256 _time,
        bytes32 _puzzleHash,
        bytes memory _signature
    ) private view returns (bool) {
        bytes32 messageHash = keccak256(
            abi.encodePacked(_time, _puzzleHash, msg.sender)
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
            emit SeasonEnded(currentSeason, block.timestamp);
            _startNewSeason();
        }
    }

    function addScore(
        uint256 _time,
        bytes32 _puzzleHash,
        bytes memory _signature
    ) external whenNotPaused {
        // Check NFT ownership
        require(nftContract.balanceOf(msg.sender) > 0, "Must own NFT to submit score");
        
        // Verify signature
        require(!usedSignatures[keccak256(_signature)], "Signature already used");
        require(
            verifySignature(_time, _puzzleHash, _signature),
            "Invalid signature"
        );
        
        checkAndUpdateSeason();
        
        SeasonInfo storage season = seasons[currentSeason];
        require(_time > 0, "Invalid time");
        require(season.isActive, "Current season is not active");
        require(block.timestamp <= season.endTime, "Season has ended");
        
        // Mark signature as used
        usedSignatures[keccak256(_signature)] = true;
        
        // Score insertion logic
        uint256 currentCount = season.scoreCount;
        uint256 insertIndex = currentCount;
        
        for(uint256 i = 0; i < currentCount; i++) {
            if(_time < season.scores[i].time) {
                insertIndex = i;
                break;
            }
        }
        
        if(insertIndex < MAX_SCORES_PER_SEASON) {
            for(uint256 i = currentCount; i > insertIndex; i--) {
                if(i < MAX_SCORES_PER_SEASON) {
                    season.scores[i] = season.scores[i-1];
                }
            }
            
            season.scores[insertIndex] = Score({
                player: msg.sender,
                time: _time,
                timestamp: block.timestamp
            });
            
            if(currentCount < MAX_SCORES_PER_SEASON) {
                season.scoreCount++;
            }
            
            emit NewScore(currentSeason, msg.sender, _time, block.timestamp);
        }
    }

    function getSeasonTopScores(uint256 _season, uint256 _limit) external view returns (
        address[] memory players,
        uint256[] memory times,
        uint256[] memory timestamps
    ) {
        require(_season > 0 && _season <= currentSeason, "Invalid season");
        require(_limit > 0, "Invalid limit");
        
        SeasonInfo storage season = seasons[_season];
        uint256 count = season.scoreCount;
        uint256 length = _limit < count ? _limit : count;
        
        players = new address[](length);
        times = new uint256[](length);
        timestamps = new uint256[](length);
        
        for(uint256 i = 0; i < length; i++) {
            Score memory score = season.scores[i];
            players[i] = score.player;
            times[i] = score.time;
            timestamps[i] = score.timestamp;
        }
    }

    function getSeasonInfo(uint256 _season) external view returns (
        uint256 startTime,
        uint256 endTime,
        bool isActive,
        uint256 totalScores,
        bool hasEnded
    ) {
        SeasonInfo storage season = seasons[_season];
        return (
            season.startTime,
            season.endTime,
            season.isActive,
            season.scoreCount,
            block.timestamp >= season.endTime + GRACE_PERIOD
        );
    }

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
        season.endTime = block.timestamp;
        emit SeasonEnded(currentSeason, block.timestamp);
        _startNewSeason();
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        owner = newOwner;
    }
}