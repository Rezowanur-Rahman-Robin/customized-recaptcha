/**
 * CaptureScreen.tsx
 * 
 * This component handles the first step of the CAPTCHA process.
 * It displays the webcam feed with a moving square target that the user needs to capture.
 * The square's position changes randomly to prevent automated attacks.
 * @author Md Rezowanur Rahman Robin
 * mail: robindrmc15cuet17@gmail.com
 * @copyright 2025, Md Rezowanur Rahman Robin
 */

'use client';

import { SELECTOR_FULL_WIDTH, WEBCAM_HEIGHT, WEBCAM_WIDTH } from '@/constants/size';
import React from 'react';
import Webcam from 'react-webcam';

// Props for the CaptureScreen component
interface CaptureScreenProps {
  webcamRef: React.RefObject<Webcam | null>;
  squarePosition: { x: number; y: number };
  onCapture: () => void;
}

/**
 * Component that displays webcam feed with moving square target
 */
export const CaptureScreen: React.FC<CaptureScreenProps> = ({
  webcamRef,
  squarePosition,
  onCapture
}) => {
  // Webcam configuration
  const videoConstraints = {
    width: WEBCAM_WIDTH,
    height: WEBCAM_HEIGHT,
    facingMode: 'user' // Use front camera
  };

  return (
    <div className="capture-screen p-4 flex flex-col items-center">      
      <p className="text-sm text-gray-600 mb-4 text-center">
        Please position your face within the camera view and click the Continue button
        when the moving square is visible.
      </p>
      
      {/* Webcam container with relative positioning for the overlay */}
      <div className="relative mb-4 border-2 border-gray-300 rounded overflow-hidden"
      style={{
        width: `${WEBCAM_WIDTH}px`,
        height: `${WEBCAM_HEIGHT}px`
      }}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className={`w-[${WEBCAM_WIDTH}px] h-[${WEBCAM_HEIGHT}px] object-cover`}
        />
        
        {/* Moving square overlay */}
        <div 
          className="absolute border-2 border-red-500 bg-red-200 bg-opacity-30"
          style={{
            left: `${squarePosition.x}px`,
            top: `${squarePosition.y}px`,
            width:  `${SELECTOR_FULL_WIDTH}px`,
            height:  `${SELECTOR_FULL_WIDTH}px`,
            transition: 'all 0.5s ease-out'
          }}
        />
      </div>
      
      <button
        onClick={onCapture}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
      >
        Continue
      </button>
      
      <div className="text-xs text-gray-500 mt-4 text-center">
        <p>The square will move randomly to prevent automated attacks.</p>
        <p>This helps us verify you are human.</p>
      </div>
    </div>
  );
};