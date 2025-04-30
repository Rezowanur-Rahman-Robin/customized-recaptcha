/**
 * ValidationScreen.tsx
 * 
 * This component handles the second step of the CAPTCHA process.
 * It displays the captured image with a grid of sectors overlaid on the target area.
 * Each sector may contain a watermark shape (triangle, square, circle) with a color tint.
 * The user must select all sectors containing the specified shape and color combination.
 * 
 * @author Md Rezowanur Rahman Robin
 * mail: robindrmc15cuet17@gmail.com
 * @copyright 2025, Md Rezowanur Rahman Robin
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { Shape, ShapeType, ColorTint } from './types';
import { SELECTOR_FULL_WIDTH, SELECTOR_WINDOW_SIZE, WEBCAM_HEIGHT, WEBCAM_WIDTH } from '@/constants/size';

// Props for the ValidationScreen component
interface ValidationScreenProps {
  capturedImage: string;
  squarePosition: { x: number; y: number };
  sectors: Shape[];
  targetShape: ShapeType;
  targetColor: ColorTint;
  selectedSectors: number[];
  onSectorSelect: (sectorId: number) => void;
  onValidate: () => void;
}

/**
 * Component that displays the captured image with sectors for validation
 */
export const ValidationScreen: React.FC<ValidationScreenProps> = ({
  capturedImage,
  squarePosition,
  sectors,
  targetShape,
  targetColor,
  selectedSectors,
  onSectorSelect,
  onValidate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Get color class based on ColorTint enum
  const getColorClass = (color: ColorTint | null): string => {
    if (!color) return '';
    
    switch (color) {
      case ColorTint.RED:
        return 'text-red-500';
      case ColorTint.GREEN:
        return 'text-green-500';
      case ColorTint.BLUE:
        return 'text-blue-500';
      default:
        return '';
    }
  };
  
  // Get background color class based on ColorTint enum
  const getBgColorClass = (color: ColorTint | null): string => {
    if (!color) return '';
    
    switch (color) {
      case ColorTint.RED:
        return 'bg-red-400 bg-opacity-50';
      case ColorTint.GREEN:
        return 'bg-green-400 bg-opacity-50';
      case ColorTint.BLUE:
        return 'bg-blue-400 bg-opacity-50';
      default:
        return '';
    }
  };
  
  // Draw shape based on ShapeType enum
  const drawShape = (ctx: CanvasRenderingContext2D, shape: ShapeType, color: ColorTint, x: number, y: number, size: number) => {
    ctx.save();
    
    // Set color based on ColorTint
    switch (color) {
      case ColorTint.RED:
        ctx.strokeStyle = 'rgba(244, 24, 24, 0.8)';
        ctx.fillStyle = 'rgba(254, 202, 202, 0.5)';
        break;
      case ColorTint.GREEN:
        ctx.strokeStyle = 'rgba(0, 169, 62, 0.8)';
        ctx.fillStyle = 'rgba(187, 247, 208, 0.5)';
        break;
      case ColorTint.BLUE:
        ctx.strokeStyle = 'rgba(0, 84, 219, 0.8)';
        ctx.fillStyle = 'rgba(191, 219, 254, 0.5)';
        break;
    }
    
    ctx.lineWidth = 2;
    
    // Draw shape based on ShapeType
    switch (shape) {
      case ShapeType.CIRCLE:
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/2 - 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
        
      case ShapeType.SQUARE:
        ctx.beginPath();
        ctx.rect(x + 5, y + 5, size - 10, size - 10);
        ctx.fill();
        ctx.stroke();
        break;
        
      case ShapeType.TRIANGLE:
        ctx.beginPath();
        ctx.moveTo(x + size/2, y + 5);
        ctx.lineTo(x + size - 5, y + size - 5);
        ctx.lineTo(x + 5, y + size - 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
    }
    
    ctx.restore();
  };
  
  // Draw the captured image with sectors and shapes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Load the captured image
    const img = new Image();
    img.src = capturedImage;
    img.onload = () => {
      // Draw the full image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Calculate sector size (divide the square into 3x3 grid)
      const sectorSize = SELECTOR_FULL_WIDTH / SELECTOR_WINDOW_SIZE;
      
      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1;
      
      // Draw horizontal grid lines
      for (let i = 1; i < SELECTOR_WINDOW_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(squarePosition.x, squarePosition.y + i * sectorSize);
        ctx.lineTo(squarePosition.x + SELECTOR_FULL_WIDTH, squarePosition.y + i * sectorSize);
        ctx.stroke();
      }
      
      // Draw vertical grid lines
      for (let i = 1; i < SELECTOR_WINDOW_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(squarePosition.x + i * sectorSize, squarePosition.y);
        ctx.lineTo(squarePosition.x + i * sectorSize, squarePosition.y + SELECTOR_FULL_WIDTH);
        ctx.stroke();
      }
      
      // Draw shapes in sectors
      sectors.forEach(sector => {
        if (sector.shape && sector.color) {
          // Calculate position for this sector
          const row = Math.floor(sector.id / SELECTOR_WINDOW_SIZE);
          const col = sector.id % SELECTOR_WINDOW_SIZE;
          const x = squarePosition.x + col * sectorSize;
          const y = squarePosition.y + row * sectorSize;
          
          // Draw the shape
          drawShape(ctx, sector.shape, sector.color, x, y, sectorSize);
        }
      });
    };
  }, [capturedImage, squarePosition, sectors]);
  
  return (
    <div className="validation-screen p-4 flex flex-col items-center">      
      <p className="text-sm text-gray-600 mb-4 text-center">
        Select all sectors containing a <span className={`font-bold ${getColorClass(targetColor)}`}>{targetColor}</span> <span className="font-bold">{targetShape}</span>.
      </p>
      
      {/* Canvas to display the captured image with sectors */}
        <div className="relative mb-4 border-2 border-gray-300 rounded overflow-hidden">
        <canvas 
            ref={canvasRef} 
            width={WEBCAM_WIDTH} 
            height={WEBCAM_HEIGHT}
            style={{ width: `${WEBCAM_WIDTH}px`, height: `${WEBCAM_HEIGHT}px` }}
        />

        {/* Clickable sector overlays */}
        <div 
            className={`absolute top-0 left-0 grid bg-white opacity-40`}
            style={{
            width: `${SELECTOR_FULL_WIDTH}px`,
            height: `${SELECTOR_FULL_WIDTH}px`,
            left: `${squarePosition.x}px`,
            top: `${squarePosition.y}px`,
            display: 'grid',
            gridTemplateColumns: `repeat(${SELECTOR_WINDOW_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${SELECTOR_WINDOW_SIZE}, 1fr)`
            }}
        >
            {Array.from({ length: SELECTOR_WINDOW_SIZE * SELECTOR_WINDOW_SIZE }).map((_, index) => {
            const isSelected = selectedSectors.includes(index);
            const currentSector = sectors.find(sector => sector.id === index);

            return (
                <div
                key={index}
                onClick={() => onSectorSelect(index)}
                className={`w-full h-full cursor-pointer border border-white border-opacity-30 ${
                    isSelected ? (currentSector?.color ? getBgColorClass(currentSector.color) : 'bg-gray-500') : ''
                }`}
                />
            );
            })}
        </div>
        </div>

      
      <button
        onClick={onValidate}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
      >
        Validate
      </button>
      
      <div className="text-xs text-gray-500 mt-4 text-center">
        <p>Click on the sectors that match the description above.</p>
      </div>
    </div>
  );
};