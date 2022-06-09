import { ApiLoggerInterceptor } from './api-logger.interceptor';

describe('ApiLoggerInterceptor', () => {
  it('should be defined', () => {
    expect(new ApiLoggerInterceptor()).toBeDefined();
  });
});
