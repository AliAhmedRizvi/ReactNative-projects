import { ValidationResult, EmailValidationOptions } from '../types/auth';

/**
 * Validates email addresses with comprehensive checks
 * This is production-ready code you'd use in real applications
 */
export class EmailValidator {
  private static readonly DEFAULT_OPTIONS: Required<EmailValidationOptions> = {
    allowInternational: true,
    allowDisplayName: false,
    requireTld: true,
    maxLength: 254, // RFC 5321 limit
  };

  /**
   * Basic regex for email validation - covers 99% of real-world cases
   * More comprehensive than most tutorials show
   */
  private static readonly EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  /**
   * International characters regex for global email support
   */
  private static readonly INTERNATIONAL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Common disposable email domains (you'd expand this list)
   */
  private static readonly DISPOSABLE_DOMAINS = new Set([
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com',
    // Add more as needed
  ]);

  /**
   * Main validation function - this is what you'll use everywhere
   */
  public static validate(
    email: string,
    options: EmailValidationOptions = {
      allowInternational: false,
    },
  ): ValidationResult {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const errors: string[] = [];
    const warnings: string[] = [];

    // Quick null/undefined check
    if (!email) {
      return {
        warnings: [],
        isValid: false,
        errors: ['Email is required']
      };
    }

    // Type check - ensure it's a string
    if (typeof email !== 'string') {
      return {
        warnings: [],
        isValid: false,
        errors: ['Email must be a string'],
      };
    }

    // Trim whitespace
    email = email.trim();

    // Length validation
    if (email.length === 0) {
      errors.push('Email cannot be empty');
    }

    if (email.length > opts.maxLength) {
      errors.push(`Email cannot exceed ${opts.maxLength} characters`);
    }

    // Basic format validation
    const regex = opts.allowInternational
      ? this.INTERNATIONAL_REGEX
      : this.EMAIL_REGEX;
    if (!regex.test(email)) {
      errors.push('Invalid email format');
    }

    // More specific validations
    if (email.includes('..')) {
      errors.push('Email cannot contain consecutive dots');
    }

    if (email.startsWith('.') || email.endsWith('.')) {
      errors.push('Email cannot start or end with a dot');
    }

    if (email.includes('@') && email.split('@').length !== 2) {
      errors.push('Email must contain exactly one @ symbol');
    }

    // Domain validations
    if (email.includes('@')) {
      const [localPart, domain] = email.split('@');

      if (localPart.length === 0) {
        errors.push('Email local part cannot be empty');
      }

      if (localPart.length > 64) {
        errors.push('Email local part cannot exceed 64 characters');
      }

      if (domain.length === 0) {
        errors.push('Email domain cannot be empty');
      }

      // TLD validation
      if (opts.requireTld && !domain.includes('.')) {
        errors.push('Email must include a top-level domain');
      }

      // Check for disposable email
      if (this.DISPOSABLE_DOMAINS.has(domain.toLowerCase())) {
        warnings.push('Disposable email address detected');
      }

      // Display name validation
      if (!opts.allowDisplayName && email.includes('<')) {
        errors.push('Display names are not allowed');
      }
    }

    return <ValidationResult>{
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Quick boolean check - useful for simple validations
   */
  public static isValid(
    email: string,
    options?: EmailValidationOptions,
  ): boolean {
    return this.validate(email, options).isValid;
  }

  /**
   * Extract domain from email - useful for business logic
   */
  public static extractDomain(email: string): string | null {
    if (!email || typeof email !== 'string') {
      return null;
    }

    const parts = email.trim().split('@');
    return parts.length === 2 ? parts[1].toLowerCase() : null;
  }

  /**
   * Check if email belongs to a specific domain
   */
  public static isFromDomain(email: string, domain: string): boolean {
    const emailDomain = this.extractDomain(email);
    return emailDomain === domain.toLowerCase();
  }

  /**
   * Normalize email for storage/comparison
   */
  public static normalize(email: string): string {
    if (!email || typeof email !== 'string') {
      return '';
    }

    return email.trim().toLowerCase();
  }
}