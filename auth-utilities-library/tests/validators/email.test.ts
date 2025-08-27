import { EmailValidator } from '../../src';

describe('EmailValidator', () => {
  describe('validate()', () => {
    describe('Valid emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user123@example.org',
        'test.email.with+symbol@example.com',
        'simple@example.co.uk',
        'very.common@example.com',
        'x@example.com',
        'long.email-address-with-hyphens@and.subdomains.example.com',
      ];

      test.each(validEmails)('should validate "%s" as valid', (email) => {
        const result = EmailValidator.validate(email);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    describe('Invalid emails', () => {
      const invalidTestCases = [
        {
          email: '',
          expectedError: 'Email cannot be empty'
        },
        {
          email: 'plainaddress',
          expectedError: 'Invalid email format'
        },
        {
          email: '@example.com',
          expectedError: 'Email local part cannot be empty'
        },
        {
          email: 'test@',
          expectedError: 'Email domain cannot be empty'
        },
        {
          email: 'test..test@example.com',
          expectedError: 'Email cannot contain consecutive dots'
        },
        {
          email: '.test@example.com',
          expectedError: 'Email cannot start or end with a dot'
        },
        {
          email: 'test.@example.com',
          expectedError: 'Email cannot start or end with a dot'
        },
        {
          email: 'test@example@com',
          expectedError: 'Email must contain exactly one @ symbol'
        },
      ];

      test.each(invalidTestCases)('should invalidate "$email" with error: $expectedError',
        ({ email, expectedError }) => {
          const result = EmailValidator.validate(email);
          expect(result.isValid).toBe(false);
          expect(result.errors).toContain(expectedError);
        }
      );
    });

    describe('Edge cases', () => {
      test('should handle null/undefined inputs', () => {
        const result1 = EmailValidator.validate(null as any);
        expect(result1.isValid).toBe(false);
        expect(result1.errors).toContain('Email is required');

        const result2 = EmailValidator.validate(undefined as any);
        expect(result2.isValid).toBe(false);
        expect(result2.errors).toContain('Email is required');
      });

      test('should handle non-string inputs', () => {
        const result = EmailValidator.validate(123 as any);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Email must be a string');
      });

      test('should trim whitespace', () => {
        const result = EmailValidator.validate('  test@example.com  ');
        expect(result.isValid).toBe(true);
      });

      test('should respect maxLength option', () => {
        const longEmail = 'a'.repeat(250) + '@example.com';
        const result = EmailValidator.validate(longEmail, { allowInternational: false, maxLength: 50 });
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Email cannot exceed 50 characters');
      });
    });

    describe('Options handling', () => {
      test('should require TLD by default', () => {
        const result = EmailValidator.validate('test@localhost');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Email must include a top-level domain');
      });

      test('should allow emails without TLD when requireTld is false', () => {
        const result = EmailValidator.validate('test@localhost', { allowInternational: false, requireTld: false });
        expect(result.isValid).toBe(true);
      });

      test('should detect disposable emails as warnings', () => {
        const result = EmailValidator.validate('test@10minutemail.com');
        expect(result.isValid).toBe(true);
        expect(result.warnings).toContain('Disposable email address detected');
      });
    });
  });

  describe('isValid()', () => {
    test('should return boolean for valid email', () => {
      expect(EmailValidator.isValid('test@example.com')).toBe(true);
    });

    test('should return boolean for invalid email', () => {
      expect(EmailValidator.isValid('invalid-email')).toBe(false);
    });
  });

  describe('extractDomain()', () => {
    test('should extract domain from valid email', () => {
      expect(EmailValidator.extractDomain('user@example.com')).toBe('example.com');
      expect(EmailValidator.extractDomain('test@subdomain.example.org')).toBe('subdomain.example.org');
    });

    test('should return null for invalid emails', () => {
      expect(EmailValidator.extractDomain('invalid-email')).toBe(null);
      expect(EmailValidator.extractDomain('')).toBe(null);
      expect(EmailValidator.extractDomain(null as any)).toBe(null);
    });

    test('should convert domain to lowercase', () => {
      expect(EmailValidator.extractDomain('user@EXAMPLE.COM')).toBe('example.com');
    });
  });

  describe('isFromDomain()', () => {
    test('should check if email is from specific domain', () => {
      expect(EmailValidator.isFromDomain('user@example.com', 'example.com')).toBe(true);
      expect(EmailValidator.isFromDomain('user@example.com', 'other.com')).toBe(false);
    });

    test('should be case insensitive', () => {
      expect(EmailValidator.isFromDomain('user@EXAMPLE.COM', 'example.com')).toBe(true);
      expect(EmailValidator.isFromDomain('user@example.com', 'EXAMPLE.COM')).toBe(true);
    });
  });

  describe('normalize()', () => {
    test('should normalize email for storage', () => {
      expect(EmailValidator.normalize('  USER@EXAMPLE.COM  ')).toBe('user@example.com');
      expect(EmailValidator.normalize('Test.User@Example.Org')).toBe('test.user@example.org');
    });

    test('should handle invalid inputs', () => {
      expect(EmailValidator.normalize(null as any)).toBe('');
      expect(EmailValidator.normalize(undefined as any)).toBe('');
      expect(EmailValidator.normalize('')).toBe('');
    });
  });

  describe('Real-world scenarios', () => {
    test('should handle corporate email validation', () => {
      const corporateEmails = [
        'john.doe@company.com',
        'jane.smith+notifications@bigcorp.org',
        'developer@startup.io',
      ];

      corporateEmails.forEach(email => {
        const result = EmailValidator.validate(email);
        expect(result.isValid).toBe(true);
      });
    });

    test('should validate emails for authentication systems', () => {
      // This is what you'll use in your Keycloak integration
      const authEmail = 'user@yourcompany.com';
      const result = EmailValidator.validate(authEmail);

      expect(result.isValid).toBe(true);
      expect(EmailValidator.extractDomain(authEmail)).toBe('yourcompany.com');
      expect(EmailValidator.normalize(authEmail)).toBe(authEmail);
    });
  });
});