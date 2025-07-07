import React, { useState } from 'react';
import { PhoneInput } from '../components/PhoneInput';
import { PhoneValidator } from '../lib/validation/phoneValidation';

export default function PhoneTestPage() {
  const [phoneValue, setPhoneValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const testNumbers = [
    '(555) 123-4567',           // US format
    '+1 555 123 4567',          // US international
    '555-123-4567',             // US dashes
    '5551234567',               // US digits only
    '+44 20 1234 5678',         // UK
    '+1-416-123-4567',          // Canada
    '123',                      // Too short
    'invalid-phone',            // Invalid
    '+999 999 999 9999',        // Invalid country code
  ];

  const runTests = () => {
    const results = testNumbers.map(number => {
      const validation = PhoneValidator.validate(number);
      return {
        input: number,
        ...validation
      };
    });
    setTestResults(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          📞 Enhanced Phone Validation Demo
        </h1>

        {/* Interactive Phone Input */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">🔧 Interactive Phone Input</h2>
          
          <div className="space-y-6">
            <PhoneInput
              value={phoneValue}
              onChange={(value, valid) => {
                setPhoneValue(value);
                setIsValid(valid);
              }}
              placeholder="Enter your phone number"
              defaultCountry="US"
              formatAsYouType={true}
              showCountryCode={true}
              className="bg-black/50 border-white/20 text-white placeholder-gray-400"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p><strong>Current Value:</strong> {phoneValue || 'None'}</p>
                <p><strong>Is Valid:</strong> 
                  <span className={isValid ? 'text-green-400' : 'text-red-400'}>
                    {isValid ? ' ✅ Yes' : ' ❌ No'}
                  </span>
                </p>
              </div>
              
              <div className="space-y-2">
                <p><strong>Features:</strong></p>
                <ul className="text-gray-300 space-y-1">
                  <li>• Real-time formatting</li>
                  <li>• International support</li>
                  <li>• Visual validation feedback</li>
                  <li>• Country detection</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Test Suite */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">🧪 Validation Test Suite</h2>
            <button
              onClick={runTests}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Run Tests
            </button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.isValid 
                      ? 'border-green-500/30 bg-green-500/10' 
                      : 'border-red-500/30 bg-red-500/10'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <strong>Input:</strong> {result.input}
                    </div>
                    <div>
                      <strong>Valid:</strong> 
                      <span className={result.isValid ? 'text-green-400' : 'text-red-400'}>
                        {result.isValid ? ' ✅' : ' ❌'}
                      </span>
                    </div>
                    <div>
                      <strong>Formatted:</strong> {result.formatted || 'N/A'}
                    </div>
                    <div>
                      <strong>Country:</strong> {result.country || 'N/A'}
                    </div>
                  </div>
                  {result.error && (
                    <p className="text-red-400 text-sm mt-2">Error: {result.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Supported Features */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6">✨ Supported Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-blue-400">📱 Format Support</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• (555) 123-4567</li>
                <li>• 555-123-4567</li>
                <li>• 555.123.4567</li>
                <li>• +1 555 123 4567</li>
                <li>• 5551234567</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-green-400">🌍 Countries</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• 🇺🇸 United States</li>
                <li>• 🇨🇦 Canada</li>
                <li>• 🇬🇧 United Kingdom</li>
                <li>• 🇦🇺 Australia</li>
                <li>• 🌍 International</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-purple-400">🛡️ Security</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Input sanitization</li>
                <li>• Format validation</li>
                <li>• Length limits</li>
                <li>• Spam detection</li>
                <li>• XSS protection</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            ← Back to Main Site
          </a>
        </div>
      </div>
    </div>
  );
}
