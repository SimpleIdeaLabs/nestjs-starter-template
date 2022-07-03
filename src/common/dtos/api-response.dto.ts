export class ApiResponse<T> {
  status: boolean;
  message: any;
  data: T;
  constructor(params: { status: boolean; message?: any; data?: T }) {
    this.status = params.status;
    this.message = params.message;
    this.data = params.data;
  }
}
