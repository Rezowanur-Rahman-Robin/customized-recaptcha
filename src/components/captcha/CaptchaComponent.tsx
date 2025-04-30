/**
 * CaptchaComponent.tsx
 * 
 * This component implements a custom CAPTCHA validation system using webcam input.
 * It follows a multi-step process:
 * 1. Captures user's image with a moving square target
 * 2. Divides the captured area into sectors with shape watermarks
 * 3. Asks user to identify sectors with specific shapes
 * 4. Validates the user's selection
 * 
 * Features:
 * - Random square movement to prevent automated attacks
 * - Shape-based watermarks (triangle, square, circle) with color tints
 * - Error tolerance that decreases with each failed attempt
 * - Responsive design
 * @author Md Rezowanur Rahman Robin
 * mail: robindrmc15cuet17@gmail.com
 * @copyright 2025, Md Rezowanur Rahman Robin
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { CaptureScreen } from './CaptureScreen';
import { ValidationScreen } from './ValidationScreen';
import { ResultScreen } from './ResultScreen';
import { Shape, ShapeType, ColorTint } from './types';
import { FAULT_TOLERANCE, MAX_RETRY, SELECTOR_FULL_WIDTH, SELECTOR_WINDOW_SIZE, WEBCAM_HEIGHT, WEBCAM_WIDTH } from '@/constants/size';

// Define the steps of the CAPTCHA process
enum CaptchaStep {
  CAPTURE = 'capture',
  VALIDATION = 'validation',
  RESULT = 'result'
}


/**
 * Main CAPTCHA component that manages the entire validation flow
 */
const CaptchaComponent: React.FC = () => {
  // State management
  const [currentStep, setCurrentStep] = useState<CaptchaStep>(CaptchaStep.CAPTURE);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [squarePosition, setSquarePosition] = useState({ x: 0, y: 0 });
  const [sectors, setSectors] = useState<Shape[]>([]);
  const [targetShape, setTargetShape] = useState<ShapeType>(ShapeType.CIRCLE);
  const [targetColor, setTargetColor] = useState<ColorTint>(ColorTint.RED);
  const [selectedSectors, setSelectedSectors] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<number>(0);
  const [passed, setPassed] = useState<boolean>(false);
  const [tolerance,setTolerance] = useState<number>(FAULT_TOLERANCE);
  
  const webcamRef = useRef<Webcam>(null);

  const maxAttempts= MAX_RETRY

  /**
   * Randomly move the square target within the webcam view
   */

  const moveSquare = () => {
    // Generate random position within the webcam view
    // Leaving margin to ensure square is fully visible
    const maxX = WEBCAM_WIDTH - SELECTOR_FULL_WIDTH; // webcam width - square size
    const maxY = WEBCAM_HEIGHT - SELECTOR_FULL_WIDTH; // webcam height - square size
    
    setSquarePosition({
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY)
    });
  };
  useEffect(() => {
    if (currentStep !== CaptchaStep.CAPTURE) return;
    
    // Move the square every 1.5 seconds
    const interval = setInterval(moveSquare, 1500);
    return () => clearInterval(interval);
  }, [currentStep]);

  /**
   * Generate sectors with random shapes and colors when moving to validation step
   */
  const generateSectors = useCallback(() => {
    const newSectors: Shape[] = [];
    const shapeTypes = Object.values(ShapeType);
    const colorTints = Object.values(ColorTint);
  
    const numOfSectors = SELECTOR_WINDOW_SIZE*SELECTOR_WINDOW_SIZE;
    const numOfShapeContainingSectors = Math.floor(numOfSectors / 2); // 50% of sectors will contain shapes
  
    // Step 1: Randomly pick 4 unique sector indices to contain shapes
    const shapeSectorIndices = new Set<number>();
    while (shapeSectorIndices.size < numOfShapeContainingSectors) {
      shapeSectorIndices.add(Math.floor(Math.random() * numOfSectors));
    }

    const actualShapeColorPairs: { shape: ShapeType; color: ColorTint }[] = []; // Store the actual shape-color pairs for ensuring the target shape and color exists among the selectors

  
    // Step 2: Generate sectors
    for (let i = 0; i < numOfSectors; i++) {
      if (shapeSectorIndices.has(i)) {
        const shape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const color = colorTints[Math.floor(Math.random() * colorTints.length)];
  
        newSectors.push({
          id: i,
          shape,
          color
        });
        if (!actualShapeColorPairs.some(pair => pair.shape === shape && pair.color === color)) {  // Check if the pair already exists
          actualShapeColorPairs.push({ shape, color });
        }

      } else {
        newSectors.push({
          id: i,
          shape: null,
          color: null
        });
      }
    }
    console.log(actualShapeColorPairs)
  
    // Step 3: Set target shape and color for validation
    const target = actualShapeColorPairs[Math.floor(Math.random() * actualShapeColorPairs.length)];
    setTargetShape(target.shape);
    setTargetColor(target.color);
  
    return newSectors;
  }, []);
  

  /**
   * Handle the capture step completion
   */
  const handleCapture = useCallback(() => {
    if (!webcamRef.current) return;
    
    // Capture the current image from webcam
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    
    // Generate sectors with shapes for validation
    const newSectors = generateSectors();
    setSectors(newSectors);
    
    // Move to validation step
    setCurrentStep(CaptchaStep.VALIDATION);
  }, [generateSectors]);

  /**
   * Handle sector selection during validation
   */
  const handleSectorSelect = useCallback((sectorId: number) => {
    setSelectedSectors(prev => {
      // Toggle selection
      if (prev.includes(sectorId)) {
        return prev.filter(id => id !== sectorId);
      } else {
        return [...prev, sectorId];
      }
    });
  }, []);

  /**
   * Validate user's selection
   */
  const handleValidate = useCallback(() => {
    // Find all sectors that should be selected (matching target shape and color)
    const correctSectors = sectors
      .filter(sector => sector.shape === targetShape && sector.color === targetColor)
      .map(sector => sector.id);
    
    // Check if user selected all correct sectors and no incorrect ones
   // const allCorrectSelected = correctSectors.every(id => selectedSectors.includes(id));
    //const noIncorrectSelected = selectedSectors.every(id => correctSectors.includes(id));

    
    // Calculate how many mistakes were made
    const missedCorrect = correctSectors.filter(id => !selectedSectors.includes(id)).length;
    const selectedIncorrect = selectedSectors.filter(id => !correctSectors.includes(id)).length;
    const totalMistakes = missedCorrect + selectedIncorrect;
    
    // Check if passed within tolerance
    const hasPassed = totalMistakes <= tolerance;
    setPassed(hasPassed);
    
    // Move to result step
    setCurrentStep(CaptchaStep.RESULT);
  
  }, [sectors, targetShape, targetColor, selectedSectors]);

  /**
   * Handle retry after failure
   */
  const handleRetry = useCallback(() => {
    // Increment attempts counter
    setAttempts(prev => prev + 1);
    if(tolerance>0){
      setTolerance(prev => prev - 1);
    }
    
    // Check if max attempts reached
    if (attempts + 1 >= maxAttempts) {
      // If max attempts reached, stay on result screen but ensure it shows failure
      setPassed(false);
    } else {
      // Reset states for a new attempt
      setCapturedImage(null);
      setSquarePosition({ x: 0, y: 0 });
      setSectors([]);
      setSelectedSectors([]);
      
      // Go back to capture step
      setCurrentStep(CaptchaStep.CAPTURE);
    }
  }, [attempts, maxAttempts]);

  // Helper function to get the text for the current attempt
  const getAttemptNoText = () => {
    if (attempts === 0) {
      return 'First Attempt';
    } else if (attempts === MAX_RETRY - 1) {
      return 'Last Chance';
    }else if (attempts === 1) {
      return 'Second Attempt';
    } else if (attempts === 2) {
      return 'Third Attempt';
    } else {
      return `${attempts + 1}th Attempt`;
    }
  };

  // Render the appropriate screen based on current step
  return (
    <div className="captcha-container w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
     {currentStep !== CaptchaStep.RESULT && (
      <>
       <h2 className="text-center text-xl font-semibold mt-2 mb-2 text-gray-500">CAPTCHA Verification</h2>
       <p className='text-center text-gray-600 text-md font-bold'> {getAttemptNoText()}</p>
       <p className='text-center text-gray-600 mt-1 text-md '> {tolerance === 0 ? 'No mistake is allowed' : `Maximum ${tolerance} ${tolerance === 1 ? 'mistake is': 'mistakes are'} allowed`} 
       </p>
      </>
     )}
      {currentStep === CaptchaStep.CAPTURE && (
        <CaptureScreen
          webcamRef={webcamRef}
          squarePosition={squarePosition}
          onCapture={handleCapture}
        />
      )}
      
      {currentStep === CaptchaStep.VALIDATION && capturedImage && (
        <ValidationScreen
          capturedImage={capturedImage}
          squarePosition={squarePosition}
          sectors={sectors}
          targetShape={targetShape}
          targetColor={targetColor}
          selectedSectors={selectedSectors}
          onSectorSelect={handleSectorSelect}
          onValidate={handleValidate}
        />
      )}
      
      {currentStep === CaptchaStep.RESULT && (
        <ResultScreen
          passed={passed}
          attempts={attempts}
          maxAttempts={maxAttempts}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
};

export default CaptchaComponent;