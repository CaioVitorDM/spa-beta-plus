export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
  error?: {
    error: {
      error: string;
      message: string;
      path: string;
      status: number;
      timestamp: string;
    };
    message: string;
    path: string;
    status: number;
    timestamp: string;
  };
};
