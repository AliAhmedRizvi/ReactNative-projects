export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface EmailValidationOptions {
  allowInternational: boolean;
  allowDisplayName?: boolean;
  requireTld?: boolean;
  maxLength?: number;

}

export interface User{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  inActive: boolean;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  tokenType: 'Bearer' | 'Basic';
  expiresIn: number;
  expiresAt: Date;
  scope?: string[];
}

export interface JWTPayload {
  sub: string;
  iss: string;
  aud: string | string[];
  exp: number;
  iat: number;
  nbf?: number;
  jti?: string;
  [key: string]: any;
}

export interface KeyCloakToken extends JWTPayload {
  preferred_username: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [client: string]: {
      roles: string[];
    };
  };

}

export interface AuthError{
  code: string;
  message: string;
  details: Record<string, any>;
  timestamp: Date;
}

export interface PKCEChallenge {
  codeVerifier: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256' | 'plain';
}

export interface AuthorizationRequest{
  clientId: string;
  redirectUri: string;
  scope: string[];
  state: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256' | 'plain';
  responseType: 'code';
}
export type AuthenticationResult =
  | { success: true; user: User; tokens: AuthToken }
  | { success: false; error: AuthError };