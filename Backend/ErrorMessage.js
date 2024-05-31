class ErrorMessage {
  static InvlidToken = "Access denied. Invalid token.";
  static NoToken = "Access denied. No token provided.";
  static SyntaxError = "Database query syntax error or data issue";
  static MissMatch = "Password Missmatch Error";
  static Error = "Password Incorrect";
  static NoEmailExist = "No email existed";
  static HashError = "Error hashing password";
  static UserNotFound = "User not found";
  static DuplicateEmail = "This email is already registered";
  static FailedMail = "Failed to send email";
  static MissingQuery = "Invalid Query strings";
  static RequiredEmail = "Email and Password are required.";
}

module.exports = ErrorMessage;
