import React, { useState, useEffect } from 'react';
import { PhoneValidator, CountryCode } from '../lib/validation/phoneValidation';
import { usePhoneInput } from '../lib/hooks/usePhoneInput';

export interface PhoneInputProps {
  value?: string;
  onChange?: (value: string, isValid: boolean) => void;
  onBlur?: () => void;
  placeholder?: string;
  defaultCountry?: CountryCode;
  formatAsYouType?: boolean;
  showCountryCode?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  errorClassName?: string;
  id?: string;
  name?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  onBlur,
  placeholder,
  defaultCountry = 'US',
  formatAsYouType = true,
  showCountryCode = true,
  disabled = false,
  required = false,
  className = '',
  errorClassName = '',
  id,
  name = 'phone'
}) => {
  const phoneInput = usePhoneInput({
    defaultCountry,
    formatAsYouType,
    validateOnChange: false
  });

  const [touched, setTouched] = useState(false);
  const [example, setExample] = useState('');

  // Set example placeholder
  useEffect(() => {
    setExample(PhoneValidator.getExample(defaultCountry));
  }, [defaultCountry]);

  // Sync with external value
  useEffect(() => {
    if (value !== phoneInput.value) {
      phoneInput.onChange(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    phoneInput.onChange(newValue);
    
    if (onChange) {
      onChange(newValue, phoneInput.validation?.isValid ?? false);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    phoneInput.onBlur();
    if (onBlur) onBlur();
  };

  const showError = touched && phoneInput.validation && !phoneInput.validation.isValid;
  const showSuccess = touched && phoneInput.validation && phoneInput.validation.isValid;

  return (
    <div className="space-y-1">
      <div className="relative">
        {showCountryCode && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500 text-sm">
              {defaultCountry === 'US' ? '🇺🇸' : 
               defaultCountry === 'CA' ? '🇨🇦' : 
               defaultCountry === 'GB' ? '🇬🇧' : 
               defaultCountry === 'AU' ? '🇦🇺' : '🌍'}
            </span>
          </div>
        )}
        
        <input
          type="tel"
          id={id}
          name={name}
          value={formatAsYouType ? phoneInput.formattedValue : phoneInput.value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder || example}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200
            ${showCountryCode ? 'pl-12' : ''}
            ${showError 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : showSuccess 
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
        />

        {/* Validation status icon */}
        {touched && phoneInput.validation && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {phoneInput.validation.isValid ? (
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {showError && phoneInput.validation && (
        <p className={`text-sm text-red-600 ${errorClassName}`}>
          {phoneInput.validation.error}
        </p>
      )}

      {/* Success message with formatted number */}
      {showSuccess && phoneInput.validation?.formatted && (
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>
            Valid phone number: {phoneInput.validation.formatted}
            {phoneInput.validation.country && phoneInput.validation.country !== 'unknown' && (
              <span className="text-gray-500"> ({phoneInput.validation.country})</span>
            )}
          </span>
        </div>
      )}

      {/* Help text */}
      {!touched && (
        <p className="text-xs text-gray-500">
          Enter your phone number. Example: {example}
        </p>
      )}
    </div>
  );
};
