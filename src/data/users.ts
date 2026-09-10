/**
 * Central credential source. Password is shared across all SauceDemo users
 * and is published on the login page, so it is safe to keep here for a demo.
 */
export const PASSWORD = 'secret_sauce';

export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
} as const;

export interface LoginCase {
  description: string;
  username: string;
  password: string;
  expectedError: string;
}

/**
 * Parameterized negative-auth data set used by the data-driven test.
 */
export const INVALID_LOGIN_CASES: LoginCase[] = [
  {
    description: 'locked out user',
    username: USERS.lockedOut,
    password: PASSWORD,
    expectedError: 'Epic sadface: Sorry, this user has been locked out.',
  },
  {
    description: 'wrong password',
    username: USERS.standard,
    password: 'wrong_password',
    expectedError:
      'Epic sadface: Username and password do not match any user in this service',
  },
  {
    description: 'empty username',
    username: '',
    password: PASSWORD,
    expectedError: 'Epic sadface: Username is required',
  },
  {
    description: 'empty password',
    username: USERS.standard,
    password: '',
    expectedError: 'Epic sadface: Password is required',
  },
];
