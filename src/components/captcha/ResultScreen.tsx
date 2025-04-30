/**
 * ResultScreen.tsx
 * 
 * This component handles the final step of the CAPTCHA process.
 * It displays the result of the validation (success or failure) and provides
 * options for retrying if the validation failed and attempts remain.
 * @author Md Rezowanur Rahman Robin
 * mail: robindrmc15cuet17@gmail.com
 * @copyright 2025, Md Rezowanur Rahman Robin
 */

'use client';

import React from 'react';

// Props for the ResultScreen component
interface ResultScreenProps {
  passed: boolean;
  attempts: number;
  maxAttempts: number;
  onRetry: () => void;
}

/**
 * Component that displays the CAPTCHA validation result
 */
export const ResultScreen: React.FC<ResultScreenProps> = ({
  passed,
  attempts,
  maxAttempts,
  onRetry
}) => {
  // Calculate remaining attempts
  const remainingAttempts = maxAttempts - attempts - 1;
  const canRetry = remainingAttempts > 0;

  console.log(remainingAttempts)
  console.log(attempts)
  
  return (
    <div className="result-screen p-6 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 text-gray-500">
        CAPTCHA {passed ? 'Successful' : 'Failed'}
      </h2>
      
      {passed ? (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <p className="text-green-600 font-medium mb-2">Verification Successful</p>
          <p className="text-sm text-gray-600 mb-4">
            You have successfully completed the CAPTCHA verification.
          </p>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <p className="text-red-600 font-medium mb-2">Verification Failed</p>
          
          {canRetry ? (
            <>
              <p className="text-sm text-gray-600 mb-4">
                You have {remainingAttempts} {remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining.
                Each attempt will have reduced tolerance for errors.
              </p>
              
              <button
                onClick={onRetry}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
              >
                Try Again
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-600 mb-4">
              You have exceeded the maximum number of attempts.
              Please try again later.
            </p>
          )}
        </div>
      )}
      
      {passed && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 w-full max-w-sm">
          <p className="text-sm text-gray-600 text-center">
            Thank you for verifying that you are human.
            You may now proceed with your intended action.
          </p>
        </div>
      )}
    </div>
  );
};