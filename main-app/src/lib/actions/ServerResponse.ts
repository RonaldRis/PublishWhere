
export interface IServerResponse<T> {
    data: T | null;
    isOk: boolean;
    message: string | null;
  }