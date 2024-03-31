
export interface IServerResponse<T> {
    result: T | null;
    isOk: boolean;
    error: string | null;
  }