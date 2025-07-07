export interface PhoneValidationResult {
  isValid: boolean;
  formatted?: string;
  country?: string;
  type?: string;
  error?: string;
}

export type CountryCode = 'US' | 'CA' | 'GB' | 'AU' | 'DE' | 'FR' | 'ES' | 'IT' | 'JP' | 'CN' | 'IN' | 'BR';

export class PhoneValidator {
  // Country-specific patterns and formatting rules
  private static patterns: Record<string, { pattern: RegExp; format: (digits: string) => string; example: string }> = {
    US: {
      pattern: /^(\+1\s?)?(\([0-9]{3}\)|[0-9]{3})[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}$/,
      format: (digits: string) => {
        if (digits.length === 10) {
          return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
        if (digits.length === 11 && digits.startsWith('1')) {
          return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
        }
        return digits;
      },
      example: '+1 (555) 123-4567'
    },
    CA: {
      pattern: /^(\+1\s?)?(\([0-9]{3}\)|[0-9]{3})[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}$/,
      format: (digits: string) => {
        if (digits.length === 10) {
          return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
        if (digits.length === 11 && digits.startsWith('1')) {
          return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
        }
        return digits;
      },
      example: '+1 (416) 123-4567'
    },
    GB: {
      pattern: /^(\+44\s?)?(\([0-9]{2,4}\)|[0-9]{2,4})[\s\-]?[0-9]{3,4}[\s\-]?[0-9]{3,4}$/,
      format: (digits: string) => {
        if (digits.length === 10 && digits.startsWith('0')) {
          return `+44 ${digits.slice(1, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
        }
        if (digits.length === 12 && digits.startsWith('44')) {
          return `+44 ${digits.slice(2, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
        }
        return digits;
      },
      example: '+44 20 1234 5678'
    },
    INTERNATIONAL: {
      pattern: /^\+[1-9]\d{1,14}$/,
      format: (digits: string) => digits.startsWith('+') ? digits : `+${digits}`,
      example: '+1 234 567 8900'
    }
  };

  /**
   * Clean phone number input (remove formatting characters)
   */
  private static cleanPhone(phoneNumber: string): string {
    return phoneNumber.replace(/[\s\-\(\)\.]/g, '');
  }

  /**
   * Extract only digits from phone number
   */
  private static extractDigits(phoneNumber: string): string {
    return phoneNumber.replace(/[^\d]/g, '');
  }

  /**
   * Validate and format a phone number
   */
  static validate(phoneNumber: string, defaultCountry: CountryCode = 'US'): PhoneValidationResult {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      return {
        isValid: false,
        error: 'Phone number is required'
      };
    }

    const cleanNumber = this.cleanPhone(phoneNumber);
    const digits = this.extractDigits(phoneNumber);

    // Check for international format
    if (cleanNumber.startsWith('+')) {
      if (this.patterns.INTERNATIONAL.pattern.test(cleanNumber)) {
        return {
          isValid: true,
          formatted: this.patterns.INTERNATIONAL.format(cleanNumber),
          country: this.detectCountryFromNumber(cleanNumber),
          type: 'international'
        };
      }
      return {
        isValid: false,
        error: 'Invalid international phone number format'
      };
    }

    // Check country-specific patterns
    const countryPattern = this.patterns[defaultCountry];
    if (countryPattern) {
      // Try to validate with country pattern
      if (this.isValidForCountry(digits, defaultCountry)) {
        return {
          isValid: true,
          formatted: countryPattern.format(digits),
          country: defaultCountry,
          type: 'national'
        };
      }
    }

    // Try other common formats
    if (digits.length >= 10 && digits.length <= 15) {
      // Basic length validation for international numbers
      return {
        isValid: true,
        formatted: this.formatBasic(digits),
        country: 'unknown',
        type: 'basic'
      };
    }

    return {
      isValid: false,
      error: `Invalid phone number. Expected format: ${countryPattern?.example || '+1 234 567 8900'}`
    };
  }

  /**
   * Check if phone number is valid for specific country
   */
  private static isValidForCountry(digits: string, country: CountryCode): boolean {
    switch (country) {
      case 'US':
      case 'CA':
        // 10 digits or 11 digits starting with 1
        return (digits.length === 10) || (digits.length === 11 && digits.startsWith('1'));
      case 'GB':
        // 10-11 digits, can start with 0 or be international
        return digits.length >= 10 && digits.length <= 11;
      default:
        return digits.length >= 10 && digits.length <= 15;
    }
  }

  /**
   * Detect country from international number
   */
  private static detectCountryFromNumber(number: string): string {
    if (number.startsWith('+1')) return 'US/CA';
    if (number.startsWith('+44')) return 'GB';
    if (number.startsWith('+49')) return 'DE';
    if (number.startsWith('+33')) return 'FR';
    if (number.startsWith('+34')) return 'ES';
    if (number.startsWith('+39')) return 'IT';
    if (number.startsWith('+81')) return 'JP';
    if (number.startsWith('+86')) return 'CN';
    if (number.startsWith('+91')) return 'IN';
    if (number.startsWith('+55')) return 'BR';
    return 'unknown';
  }

  /**
   * Basic formatting for unknown countries
   */
  private static formatBasic(digits: string): string {
    if (digits.length <= 10) {
      return `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    }
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }

  /**
   * Format phone number as user types (for real-time formatting)
   */
  static formatAsYouType(value: string, defaultCountry: CountryCode = 'US'): string {
    const digits = this.extractDigits(value);
    
    if (value.startsWith('+')) {
      // International formatting
      if (digits.length <= 15) {
        return this.formatInternationalAsYouType(digits);
      }
      return value;
    }

    // Country-specific formatting
    return this.formatNationalAsYouType(digits, defaultCountry);
  }

  /**
   * Format international number as user types
   */
  private static formatInternationalAsYouType(digits: string): string {
    if (digits.length === 0) return '+';
    if (digits.length <= 3) return `+${digits}`;
    if (digits.length <= 6) return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 10) return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10)}`;
  }

  /**
   * Format national number as user types
   */
  private static formatNationalAsYouType(digits: string, country: CountryCode): string {
    switch (country) {
      case 'US':
      case 'CA':
        return this.formatUSAsYouType(digits);
      case 'GB':
        return this.formatGBAsYouType(digits);
      default:
        return digits;
    }
  }

  /**
   * Format US/CA number as user types
   */
  private static formatUSAsYouType(digits: string): string {
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  /**
   * Format GB number as user types
   */
  private static formatGBAsYouType(digits: string): string {
    if (digits.length === 0) return '';
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
  }

  /**
   * Quick validation for forms (boolean result)
   */
  static isValid(phoneNumber: string, defaultCountry: CountryCode = 'US'): boolean {
    return this.validate(phoneNumber, defaultCountry).isValid;
  }

  /**
   * Get example phone number for country
   */
  static getExample(country: CountryCode): string {
    return this.patterns[country]?.example || this.patterns.INTERNATIONAL.example;
  }
}

// Common phone number patterns for additional validation
export const PHONE_PATTERNS = {
  US: /^(\+1\s?)?(\([0-9]{3}\)|[0-9]{3})[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}$/,
  INTERNATIONAL: /^\+[1-9]\d{1,14}$/,
  DIGITS_ONLY: /^\d{10,15}$/
};

// Phone number examples for different countries
export const PHONE_EXAMPLES = {
  US: '+1 (555) 123-4567',
  CA: '+1 (416) 123-4567',
  GB: '+44 20 1234 5678',
  AU: '+61 2 1234 5678',
  GENERIC: '+1 234 567 8900'
};
