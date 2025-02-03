import React, { useState, useRef } from 'react';
import { Heart, Star, Circle, Upload, X } from 'lucide-react';
import Fireworks from './components/Fireworks';
import TokenBoard from './components/TokenBoard';

// Define types for token shapes and token data
type TokenShape = 'heart' | 'star' | 'circle' | 'custom';

interface Token {
  shape: TokenShape;
  color: string;
  completed: boolean;
  customImage?: string;
}

function App() {
  // State management for token configuration
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenCount, setTokenCount] = useState(5);
  const [selectedShape, setSelectedShape] = useState<TokenShape>('circle');
  const [selectedColor, setSelectedColor] = useState('#AC3B61');
  const [showBoard, setShowBoard] = useState(false);
  const [workingFor, setWorkingFor] = useState('');
  const [rewardImage, setRewardImage] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rewardInputRef = useRef<HTMLInputElement>(null);

  // Handle custom token image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedShape('custom');
        setPreviewImage(result);
        // Store the image data in the tokens
        const newTokens = Array(tokenCount).fill(null).map(() => ({
          shape: 'custom',
          color: selectedColor,
          completed: false,
          customImage: result
        }));
        setTokens(newTokens);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle reward image upload
  const handleRewardUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRewardImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Initialize token board
  const initializeTokens = () => {
    if (selectedShape !== 'custom') {
      const newTokens = Array(tokenCount).fill(null).map(() => ({
        shape: selectedShape,
        color: selectedColor,
        completed: false
      }));
      setTokens(newTokens);
    }
    setShowBoard(true);
  };

  // Handle shape selection and color picker
  const handleShapeSelect = (shape: TokenShape) => {
    setSelectedShape(shape);
    if (shape !== 'custom') {
      setShowColorPicker(true);
    }
  };

  // Render the configuration page
  const renderConfigPage = () => (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center text-[#123C69] mb-12">Token Board Creator</h1>
      
      <div className="bg-[#FEE2DC] rounded-lg shadow-xl p-8 mb-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Working For Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-[#123C69] mb-2">
                  I'm working for
                </label>
                <input
                  type="text"
                  value={workingFor}
                  onChange={(e) => setWorkingFor(e.target.value)}
                  className="w-full px-4 py-2 border border-[#BAB2B5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#AC3B61]"
                  placeholder="Enter what you're working for"
                />
              </div>
              <div className="w-full md:w-auto">
                <button
                  onClick={() => rewardInputRef.current?.click()}
                  className="w-full md:w-auto px-4 py-2 bg-[#123C69] text-white rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Upload Picture
                </button>
                <input
                  ref={rewardInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleRewardUpload}
                  className="hidden"
                />
              </div>
            </div>
            {rewardImage && (
              <div className="mt-4">
                <img
                  src={rewardImage}
                  alt="Reward"
                  className="w-48 h-48 object-contain rounded-lg border-4 border-[#123C69]"
                />
              </div>
            )}
          </div>

          {/* Token Configuration */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#123C69] mb-2">
                Number of Tokens
              </label>
              <input
                type="number"
                min="1"
                value={tokenCount}
                onChange={(e) => setTokenCount(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-[#BAB2B5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#AC3B61]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#123C69] mb-2">
                Token Shape
              </label>
              <div className="flex flex-wrap gap-4 items-center">
                {(['heart', 'star', 'circle'] as const).map((shape) => (
                  <button
                    key={shape}
                    onClick={() => handleShapeSelect(shape)}
                    className={`p-3 rounded-md transition-colors ${
                      selectedShape === shape ? 'bg-[#EDC7B7]' : 'hover:bg-[#BAB2B5]'
                    }`}
                  >
                    {React.createElement(shape === 'heart' ? Heart : shape === 'star' ? Star : Circle, {
                      size: 24,
                      className: selectedShape === shape ? 'text-[#AC3B61]' : 'text-[#123C69]'
                    })}
                  </button>
                ))}
                <div className="relative flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-3 rounded-md transition-colors ${
                      selectedShape === 'custom' ? 'bg-[#EDC7B7]' : 'hover:bg-[#BAB2B5]'
                    }`}
                  >
                    <Upload size={24} className={selectedShape === 'custom' ? 'text-[#AC3B61]' : 'text-[#123C69]'} />
                  </button>
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Token preview"
                      className="w-8 h-8 object-contain rounded"
                    />
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <div className="flex justify-center">
            <button
              onClick={initializeTokens}
              className="px-8 py-4 bg-[#AC3B61] text-white rounded-md hover:bg-opacity-90 transition-colors text-lg font-semibold"
            >
              Create Token Board
            </button>
          </div>
        </div>
      </div>

      {/* Color Picker Modal */}
      {showColorPicker && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#123C69]">Choose Token Color</h3>
              <button
                onClick={() => setShowColorPicker(false)}
                className="text-[#123C69] hover:text-[#AC3B61]"
              >
                <X size={24} />
              </button>
            </div>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full h-12 rounded-md cursor-pointer mb-4"
            />
            <button
              onClick={() => setShowColorPicker(false)}
              className="w-full px-4 py-2 bg-[#AC3B61] text-white rounded-md hover:bg-opacity-90"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#EDC7B7]">
      {!showBoard ? (
        renderConfigPage()
      ) : (
        <TokenBoard
          tokens={tokens}
          setTokens={setTokens}
          workingFor={workingFor}
          rewardImage={rewardImage}
          onBack={() => setShowBoard(false)}
        />
      )}
    </div>
  );
}

export default App;