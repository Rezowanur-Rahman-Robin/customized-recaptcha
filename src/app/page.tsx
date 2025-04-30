/**
 * Main page component that demonstrates the custom CAPTCHA implementation.
 * This page provides a simple interface to test the CAPTCHA functionality.
 * @author Md Rezowanur Rahman Robin
 * mail: robindrmc15cuet17@gmail.com
 * @copyright 2025, Md Rezowanur Rahman Robin
 */

import CaptchaComponent from '@/components/captcha/CaptchaComponent';

export default function Home() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <CaptchaComponent />
    </div>
  );
}
