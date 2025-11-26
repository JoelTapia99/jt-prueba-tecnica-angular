export interface ISuccessfulApiResponse<T> {
  message: string;
  data: T;
}

export interface IBadApiResponse {
  name: string;
  message: string;
}
