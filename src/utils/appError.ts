/**
 * Custom error class used throughout the app to separate user-friendly messages from internal technical details.
 *
 * Useful for error logging while keeping clean UX in toasts, modals, or banners.
 */

class AppError extends Error {
  // Safe message to display to the user (in toasts, UIs, etc.)
  userMessage: string;

  constructor(userMessage: string, technicalDetails?: string) {
    super(technicalDetails ?? userMessage);
    this.name = "AppError";
    this.userMessage = userMessage;
  }
}

export default AppError;
