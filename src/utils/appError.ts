class AppError extends Error {
  userMessage: string;
  constructor(userMessage: string, technicalDetails?: string) {
    super(technicalDetails ?? userMessage);
    this.name = "AppError";
    this.userMessage = userMessage;
  }
}

export default AppError;
