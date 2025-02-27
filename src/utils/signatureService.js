// src/utils/signatureService.js
import { toast } from 'react-toastify';

// Message constants
const START_GAME_MESSAGE = "I want to start a Crypto Sudoku game";
const NEW_GAME_MESSAGE = "I want to start a new Crypto Sudoku game";

// Function to request a signature from the user
export const requestSignature = async (address, signMessageAsync, message) => {
  try {
    if (!address || !signMessageAsync) {
      throw new Error("Wallet not connected");
    }
    
    // Add timestamp to make each signature unique
    const timestamp = new Date().toISOString();
    const fullMessage = `${message}\nTimestamp: ${timestamp}`;
    
    console.log("Preparing to sign message:", fullMessage);
    
    // Request signature from the user - updated for wagmi v2
    const signature = await signMessageAsync({
      message: fullMessage
    });
    
    console.log("Signature obtained successfully");
    
    // Return both the message and signature
    return {
      message: fullMessage,
      signature
    };
  } catch (error) {
    console.error("Signature error:", error);
    
    // Detect user rejection
    if (error.code === 4001 || error.message.includes("rejected") || error.message.includes("denied")) {
      toast.error("You need to sign the message to play the game");
      throw new Error("User rejected signing");
    }
    
    // Other errors
    toast.error("Failed to sign message: " + error.message);
    throw error;
  }
};

// Function specifically for starting a game
export const requestGameStartSignature = async (address, signMessageAsync) => {
  return requestSignature(address, signMessageAsync, START_GAME_MESSAGE);
};

// Function specifically for starting a new game
export const requestNewGameSignature = async (address, signMessageAsync) => {
  return requestSignature(address, signMessageAsync, NEW_GAME_MESSAGE);
};