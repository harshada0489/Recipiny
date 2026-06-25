import { colors } from '@/theme/colors';

export type StrengthLevel = 'empty' | 'tooShort' | 'weak' | 'fair' | 'strong';

export type PasswordStrength = {
  level: StrengthLevel;
  score: number; // 0–5, count of satisfied criteria
  label: string;
  color: string;
  segments: number; // 0–5, used to render the segmented bar
};

/**
 * Score the password against Cognito's default policy criteria:
 *   - 8+ characters
 *   - lowercase letter
 *   - uppercase letter
 *   - number
 *   - symbol (non-alphanumeric)
 *
 * Returns a strength descriptor we render under the field. The score
 * isn't an authoritative check — Cognito itself enforces these rules on
 * sign-up and surfaces a specific error if any are missing.
 */
export function passwordStrength(pw: string): PasswordStrength {
  if (!pw) {
    return { level: 'empty', score: 0, label: '', color: colors.dim, segments: 0 };
  }

  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[a-z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;

  if (pw.length < 8) {
    return { level: 'tooShort', score, label: 'Too short', color: colors.danger, segments: 1 };
  }
  if (score <= 2) {
    return { level: 'weak', score, label: 'Weak', color: colors.danger, segments: 2 };
  }
  if (score <= 4) {
    return { level: 'fair', score, label: 'Fair', color: '#E5A742', segments: 4 };
  }
  return { level: 'strong', score, label: 'Strong', color: colors.accent, segments: 5 };
}
