import { ValidationError } from 'class-validator';

export class ApiResponse<T> {
  /**
   * Request Status
   */
  status: boolean;

  /**
   * Optional Message
   */
  message?: string;

  /**
   * Class Validator Errors
   * Parameters validation
   */
  validationErrors?: any[];

  /**
   * Data returned with specified type
   */
  data?: T;
}
