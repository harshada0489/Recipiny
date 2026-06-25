import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { userPool } from './config';

/**
 * Thin wrappers around the Cognito SDK so the rest of the app deals in
 * promises and friendly error messages rather than callback-style APIs
 * and cryptic `__type` strings.
 */

export type AuthUser = {
  email: string;
  sub: string;
};

function cognitoUser(email: string): CognitoUser {
  return new CognitoUser({ Username: email, Pool: userPool });
}

/**
 * Translate Cognito's `name` (or `code`) error strings into messages a
 * user can act on. Anything unrecognised falls back to the raw message.
 */
function friendly(err: any): Error {
  const name: string = err?.name ?? err?.code ?? '';
  const message: string = err?.message ?? String(err ?? 'Unknown error');
  switch (name) {
    case 'UsernameExistsException':
      return new Error('An account already exists for this email.');
    case 'UserNotFoundException':
      return new Error('No account found for this email.');
    case 'NotAuthorizedException':
      // Cognito returns this for both "wrong password" and "user is disabled".
      if (/disabled/i.test(message)) return new Error('This account is disabled.');
      return new Error('Incorrect email or password.');
    case 'UserNotConfirmedException':
      return new Error('Please verify your email before signing in.');
    case 'CodeMismatchException':
      return new Error('That code is incorrect. Check the email and try again.');
    case 'ExpiredCodeException':
      return new Error('That code has expired. Request a new one.');
    case 'InvalidPasswordException':
      return new Error(message.replace(/^Password did not conform with policy: /, ''));
    case 'InvalidParameterException':
      return new Error(message);
    case 'LimitExceededException':
      return new Error('Too many attempts. Try again in a few minutes.');
    default:
      return new Error(message);
  }
}

/* ───────── Sign Up ────────── */

export function signUp(email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const attrs = [new CognitoUserAttribute({ Name: 'email', Value: email })];
    userPool.signUp(email, password, attrs, [], (err) => {
      if (err) return reject(friendly(err));
      resolve();
    });
  });
}

export function confirmSignUp(email: string, code: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cognitoUser(email).confirmRegistration(code, true, (err) => {
      if (err) return reject(friendly(err));
      resolve();
    });
  });
}

export function resendConfirmationCode(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cognitoUser(email).resendConfirmationCode((err) => {
      if (err) return reject(friendly(err));
      resolve();
    });
  });
}

/* ───────── Sign In / Sign Out ────────── */

export function signIn(email: string, password: string): Promise<AuthUser> {
  return new Promise((resolve, reject) => {
    const user = cognitoUser(email);
    const auth = new AuthenticationDetails({ Username: email, Password: password });
    user.authenticateUser(auth, {
      onSuccess: (session: CognitoUserSession) => {
        const payload = session.getIdToken().decodePayload() as { email: string; sub: string };
        resolve({ email: payload.email, sub: payload.sub });
      },
      onFailure: (err) => reject(friendly(err)),
      newPasswordRequired: () => reject(new Error('You must set a new password. Please use Forgot Password.')),
    });
  });
}

export function signOut(): Promise<void> {
  // Local-only sign-out: synchronously clears the cached tokens from
  // AsyncStorage. Do NOT pass a callback — that variant triggers a
  // globalSignOut() that revokes tokens server-side and requires the full
  // CognitoUserSession to be loaded. It throws "this.jwtToken.split is
  // not a function" on a cold start where only AsyncStorage was rehydrated.
  // Local sign-out is sufficient: orphaned tokens expire naturally and
  // can't be reused without the password anyway.
  const u = userPool.getCurrentUser();
  if (u) u.signOut();
  return Promise.resolve();
}

/* ───────── Session restore ────────── */

/**
 * Read the persisted session (if any) and return the signed-in user.
 * Used on app launch to keep the user signed in across restarts.
 */
export function getCurrentUser(): Promise<AuthUser | null> {
  return new Promise((resolve) => {
    const u = userPool.getCurrentUser();
    if (!u) return resolve(null);
    u.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session?.isValid()) return resolve(null);
      const payload = session.getIdToken().decodePayload() as { email: string; sub: string };
      resolve({ email: payload.email, sub: payload.sub });
    });
  });
}

/* ───────── Forgot password ────────── */

export function forgotPassword(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cognitoUser(email).forgotPassword({
      onSuccess: () => resolve(),
      onFailure: (err) => reject(friendly(err)),
    });
  });
}

export function confirmForgotPassword(
  email: string,
  code: string,
  newPassword: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    cognitoUser(email).confirmPassword(code, newPassword, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(friendly(err)),
    });
  });
}
