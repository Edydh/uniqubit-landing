import { useState, useCallback } from 'react';
import { PhoneValidator, PhoneValidationResult, CountryCode } from '../validation/phoneValidation';

export interface UsePhoneInputOptions {
  defaultCountry?: CountryCode;
  formatAsYouType?: boolean;
  validateOnChange?: boolean;
}

export interface UsePhoneInputReturn {
  value: string;
  formattedValue: string;
  validation: PhoneValidationResult | null;
  isValid: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
  reset: () => void;
}

export function usePhoneInput(options: UsePhoneInputOptions = {}): UsePhoneInputReturn {
  const {
    defaultCountry = 'US',
    formatAsYouType = true,
    validateOnChange = false
  } = options;

  const [value, setValue] = useState('');
  const [validation, setValidation] = useState<PhoneValidationResult | null>(null);

  const onChange = useCallback((newValue: string) => {
    setValue(newValue);
    
    if (validateOnChange && newValue.trim()) {
      const result = PhoneValidator.validate(newValue, defaultCountry);
      setValidation(result);
    } else {
      setValidation(null);
    }
  }, [defaultCountry, validateOnChange]);

  const onBlur = useCallback(() => {
    if (value.trim()) {
      const result = PhoneValidator.validate(value, defaultCountry);
      setValidation(result);
    }
  }, [value, defaultCountry]);

  const reset = useCallback(() => {
    setValue('');
    setValidation(null);
  }, []);

  const formattedValue = formatAsYouType && value 
    ? PhoneValidator.formatAsYouType(value, defaultCountry)
    : value;

  return {
    value,
    formattedValue,
    validation,
    isValid: validation?.isValid ?? false,
    onChange,
    onBlur,
    reset
  };
}
