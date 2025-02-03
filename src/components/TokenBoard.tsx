import React, { useState } from 'react';
import { Heart, Star, Circle, ArrowLeft, RotateCcw } from 'lucide-react';
import Fireworks from './Fireworks';

// Define types for props and token data
interface TokenBoardProps {
  tokens: Token[];
  setTokens: React.Dispatch<React.SetStateAction<Token[]>>;
  workingFor: string;
  rewardImage: string;
  onBack: () => void;
}

interface Token {
  shape: 'heart' | 'star' | 'circle' | 'custom';
  color: string;
  completed: boolean;
  customImage?: string;
}

const TokenBoard: React.FC<TokenBoardProps> = ({
  tokens,
  setTokens,
  workingFor,
  rewardImage,
  onBack
}) => {
  // State for managing completion effects
  const [showFireworks, setShowFireworks] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle token click
  const toggleToken = (index: number) => {
    const newTokens = [...tokens];
    newTokens[index].completed = !newTokens[index].completed;
    setTokens(newTokens);

    if (newTokens.every(token => token.completed)) {
      setShowFireworks(true);
      setShowSuccess(true);
    }
  };

  // Reset token board
  const resetTokenBoard = () => {
    const newTokens = tokens.map(token => ({
      ...token,
      completed: false
    }));
    setTokens(newTokens);
    setShowFireworks(false);
    setShowSuccess(false);
  };

  // Get the appropriate icon component based on shape
  const getTokenIcon = (shape: Token['shape']) => {
    switch (shape) {
      case 'heart':
        return Heart;
      case 'star':
        return Star;
      case 'circle':
        return Circle;
      default:
        return Circle;
    }
  };

  // Render individual token
  const renderToken = (token: Token, index: number) => {
    if (!token.completed) {
      return (
        <div
          className="w-16 h-16 md:w-20 md:h-20 border-2 border-[#123C69] rounded-lg cursor-pointer hover:bg-[#FEE2DC] transition-colors"
          onClick={() => toggleToken(index)}
        />
      );
    }

    if (token.shape === 'custom' && token.customImage) {
      return (
        <img
          src={token.customImage}
          alt="Custom token"
          className="w-16 h-16 md:w-20 md:h-20 object-contain cursor-pointer transition-transform hover:scale-110"
          onClick={() => toggleToken(index)}
        />
      );
    }

    const TokenIcon = getTokenIcon(token.shape);
    
    return (
      <TokenIcon
        size={64}
        fill={token.color}
        stroke={token.color}
        className="transition-transform hover:scale-110 cursor-pointer"
        onClick={() => toggleToken(index)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#EDC7B7] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Working For Information */}
        <div className="bg-[#FEE2DC] rounded-lg shadow-xl p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#123C69]">
                I'm working for: <span className="text-[#AC3B61]">{workingFor}</span>
              </h2>
            </div>
            {rewardImage && (
              <img
                src={rewardImage}
                alt="Reward"
                className="w-32 h-32 md:w-48 md:h-48 object-contain rounded-lg border-4 border-[#123C69]"
              />
            )}
          </div>
        </div>

        {/* Token Board */}
        <div className="bg-white rounded-lg shadow-xl p-4 md:p-8 mb-8">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 justify-items-center">
            {tokens.map((token, index) => (
              <div key={index}>{renderToken(token, index)}</div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={resetTokenBoard}
            className="px-8 py-4 bg-[#AC3B61] text-white rounded-md hover:bg-opacity-90 transition-colors text-lg font-semibold flex items-center gap-2"
          >
            <RotateCcw size={24} />
            Reset Board
          </button>
          <button
            onClick={onBack}
            className="px-8 py-4 bg-[#AC3B61] text-white rounded-md hover:bg-opacity-90 transition-colors text-lg font-semibold flex items-center gap-2"
          >
            <ArrowLeft size={24} />
            Back
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
            <h2 className="text-6xl font-bold text-white mb-4 animate-bounce">
              YOU DID IT!
            </h2>
            <p className="text-3xl text-white mb-8">
              Now it's time for {workingFor}
            </p>
            {rewardImage && (
              <img
                src={rewardImage}
                alt="Reward"
                className="w-64 h-64 object-contain rounded-lg"
              />
            )}
            <button
              onClick={() => {
                setShowSuccess(false);
                setShowFireworks(false);
              }}
              className="mt-8 px-8 py-4 bg-[#AC3B61] text-white rounded-md hover:bg-opacity-90 transition-colors text-lg font-semibold"
            >
              Close
            </button>
          </div>
        )}

        {/* Fireworks Effect */}
        {showFireworks && <Fireworks />}
      </div>
    </div>
  );
};

export default TokenBoard;