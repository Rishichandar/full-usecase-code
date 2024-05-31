class GenericResponse {
  constructor(Status, ErrMessage, Response) {
    this.Status = Status;
    this.ErrMessage = ErrMessage;
    this.Response = Response;
  }
}

class ResponseStatus {
  static Success = "Success";
  static Failure = "Failure";
}

module.exports = { GenericResponse, ResponseStatus };
