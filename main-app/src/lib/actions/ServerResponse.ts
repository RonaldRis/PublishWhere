
export interface IServerResponse<T> {
    data: T | null;
    isOk: boolean;
    error: string | null;
  }