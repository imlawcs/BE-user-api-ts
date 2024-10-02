class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
      super(message); // Gọi constructor của lớp Error
      this.name = 'ApiError';
      this.statusCode = statusCode;

      // Giúp ghi lại dấu vết của hàm khi lỗi được tạo ra
      Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
