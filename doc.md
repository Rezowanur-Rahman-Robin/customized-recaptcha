# Custom CAPTCHA Implementation Documentation

## Project Overview

This project implements a novel CAPTCHA (Completely Automated Public Turing test to tell Computers and Humans Apart) validation system using webcam input and shape recognition. Unlike traditional text-based CAPTCHAs, this implementation uses visual elements and user interaction to verify human presence.

## Features

- **Webcam-based verification**: Uses the user's webcam to capture images
- **Moving target**: Random square movement prevents automated attacks
- **Shape recognition**: Uses geometric shapes (circle, square, triangle) with color tints
- **Progressive difficulty**: Error tolerance decreases with each failed attempt
- **Responsive design**: Works across different device sizes
- **Configurable settings**: Easily adjust tolerance, attempts, and dimensions

## Technology Stack

- **Framework**: Next.js
- **UI Library**: React
- **Styling**: TailwindCSS
- **Webcam Access**: react-webcam
- **Language**: TypeScript

## Implementation Details

### Architecture

The CAPTCHA system is implemented as a multi-step process:

#### 1. Capture Step
- Accesses the user's webcam
- Displays a randomly moving square target on the webcam feed
- User captures their image when ready

#### 2. Validation Step
- Divides the captured area into a grid of sectors (6×6 by default)
- Randomly assigns shape watermarks (triangle, square, circle) with color tints (red, green, blue) to 50% of sectors
- Asks the user to identify all sectors containing a specific shape and color combination
- User selects sectors and submits for validation

#### 3. Result Step
- Evaluates the user's selection against the correct sectors
- Calculates mistakes (missed correct sectors + selected incorrect sectors)
- Determines if the user passed based on the tolerance threshold
- Provides feedback and retry options if failed

### Key Components

1. **CaptchaComponent**: Main component that manages the entire flow and state
2. **CaptureScreen**: Handles webcam display and image capture
3. **ValidationScreen**: Displays the captured image with sectors and handles user selection
4. **ResultScreen**: Shows the validation result and retry options
5. **Types**: Defines shape types, color tints, and sector structure

### Security Features

1. **Moving Target**: The capture square moves randomly to prevent automated attacks
2. **Random Shape Distribution**: Shapes and colors are randomly distributed in sectors
3. **Decreasing Tolerance**: Error tolerance decreases with each failed attempt
4. **Limited Attempts**: Maximum of 3 attempts before requiring a refresh

## Configuration

The system can be configured through constants defined in `src/constants/size.ts`:

```typescript
export const SELECTOR_WINDOW_SIZE = 6;     // Number of sectors per row/column
export const SELECTOR_FULL_WIDTH = 180;    // Width/height of the selector square in pixels
export const WEBCAM_WIDTH = 350;           // Width of the webcam view in pixels
export const WEBCAM_HEIGHT = 280;          // Height of the webcam view in pixels
export const FAULT_TOLERANCE = 2;          // Initial number of mistakes allowed
export const MAX_RETRY = 3;                // Maximum number of retry attempts
```

### User Flow
1. User sees webcam feed with a moving square
2. User clicks "Continue" when ready
3. User selects all sectors containing the specified shape and color
4. User clicks "Validate" to submit their selection
5. If successful, the CAPTCHA is passed
6. If unsuccessful, the user can retry (with reduced error tolerance)

## Customization
The CAPTCHA can be customized by:

1. Modifying the constants in src/constants/size.ts
2. Adding new shape types in src/components/captcha/types.ts
3. Adding new color tints in src/components/captcha/types.ts
4. Customizing the UI through TailwindCSS classes


## Accessibility Considerations
- The system uses both shapes and colors for identification
- Clear instructions are provided at each step
- Visual feedback is given for selections and results
- Error tolerance allows for some mistakes


## Future Enhancements
Potential improvements for this CAPTCHA system could include:

1. Audio alternatives for visually impaired users
2. More complex shape patterns or animations
3. Machine learning to adapt difficulty based on user behavior
4. Additional verification methods (like motion detection)
5. Support for mobile device orientation changes


## License
Copyright 2025, Md Rezowanur Rahman Robin