import { isStudioDevEnvironment } from './envUtils';

/**
 * Detects whether the current session is running strictly inside the Google AI Studio Development Screen (iframe).
 * 
 * USER DIRECTIVE:
 * - In the programming workspace iframe: isDevEnvironment() === true (allows editing and admin controls)
 * - In ANY copied link, shared link (ais-pre-), new browser tab, or production domain: isDevEnvironment() === false
 *   (completely hides and removes all edit/delete buttons, banners, and change triggers)
 */
export function isDevEnvironment(): boolean {
  return isStudioDevEnvironment();
}
