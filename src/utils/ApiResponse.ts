class ApiResponse {
  public statusCode: number;
  public message: string;
  public data: unknown;
  public success: boolean;

  constructor(statusCode: number, message: string, data: unknown) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
