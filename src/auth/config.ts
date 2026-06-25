import { CognitoUserPool } from 'amazon-cognito-identity-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Cognito User Pool configuration. These values are not secrets — they
 * identify the pool to the Cognito API and are safe to ship in the app.
 *
 * The actual secret used for authentication is the user's password (or
 * tokens after sign-in), never these IDs.
 */
export const COGNITO_CONFIG = {
  region: 'us-west-2',
  userPoolId: 'us-west-2_932EsJzuO',
  clientId: '3ereibcg3a0fio0tlp7bt7p6sr',
} as const;

/**
 * The default Cognito SDK tries to use browser localStorage to persist
 * tokens between sessions. In React Native that's a no-op, so we pass
 * AsyncStorage explicitly. Tokens (id/access/refresh) survive app
 * restarts and let us auto-sign-in returning users.
 */
export const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_CONFIG.userPoolId,
  ClientId: COGNITO_CONFIG.clientId,
  Storage: AsyncStorage as unknown as ICognitoStorage,
});

// amazon-cognito-identity-js doesn't export its ICognitoStorage type; the
// shape it needs is just AsyncStorage's get/set/remove/clear surface.
type ICognitoStorage = {
  setItem(key: string, value: string): void | Promise<void>;
  getItem(key: string): string | null | Promise<string | null>;
  removeItem(key: string): void | Promise<void>;
  clear(): void | Promise<void>;
};
