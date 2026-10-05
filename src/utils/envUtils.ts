/**
 * Environment detection utility for Google AI Studio workspace vs. Copied / Shared / Production links.
 * 
 * USER DIRECTIVE:
 * The download button must ONLY be visible in the Google AI Studio programming screen (the preview iframe).
 * When copying the link to send to a manager, friend, or opening it in any standalone browser window/tab,
 * the download button must be 100% removed and invisible everywhere (Navbar, Mobile Menu, Footer, and DOM).
 */

export function isStudioDevEnvironment(): boolean {
  if (typeof window === 'undefined') return false;

  const hostname = window.location.hostname.toLowerCase();
  const search = window.location.search;
  const urlParams = new URLSearchParams(search);

  // 1. Explicit disable overrides
  if (urlParams.get('published') === 'true' || urlParams.get('download') === 'false' || urlParams.get('guest') === 'true') {
    return false;
  }

  // 2. Google AI Studio Published / Shared links start with "ais-pre-" -> STRICTLY FALSE
  if (hostname.startsWith('ais-pre-')) {
    return false;
  }

  // 3. Any external production domain (e.g. kemizone.com, custom domains, cPanel) -> STRICTLY FALSE
  if (!hostname.startsWith('ais-dev-') && hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '0.0.0.0') {
    return false;
  }

  // 4. THE CORE REQUIREMENT:
  // Inside the Google AI Studio programming screen, the preview runs strictly inside an iframe (window.self !== window.top).
  // When a user copies the URL (e.g. to send to friends or manager), the recipient opens it as a top-level tab (window.self === window.top).
  // Therefore, any copied or standalone link will ALWAYS have isInsideIframe = false, completely removing the download button.
  let isInsideIframe = false;
  try {
    isInsideIframe = window.self !== window.top;
  } catch {
    // A cross-origin SecurityError accessing window.top confirms it is running inside an external iframe (AI Studio IDE)
    isInsideIframe = true;
  }

  return isInsideIframe;
}
