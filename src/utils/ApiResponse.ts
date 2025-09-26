class ApiResponse<T> {
  public statusCode: number;
  public message: string;
  public data: T;
  public success: boolean;

  constructor(statusCode: number, message: string = "Success", data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
