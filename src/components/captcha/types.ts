/**
 * types.ts
 * 
 * This file contains type definitions for the CAPTCHA component.
 * It defines the shape types, color tints, and sector structure used in the CAPTCHA validation.
 * 
 * @author Md Rezowanur Rahman Robin
 * mail: robindrmc15cuet17@gmail.com
 * @copyright 2025, Md Rezowanur Rahman Robin
 */

// Define the possible shapes for watermarks
export enum ShapeType {
  TRIANGLE = 'triangle',
  SQUARE = 'square',
  CIRCLE = 'circle'
}

// Define the possible color tints for watermarks
export enum ColorTint {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue'
}

// Define the structure of a sector with shape and color
export interface Shape {
  id: number;
  shape: ShapeType | null;
  color: ColorTint | null;
}