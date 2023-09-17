export type Issue = {
  path: string;
  message: string;
};

export interface IApiError {
  message: string;
  name: string;
  statusCode: number;
  issues?: Issue[];
}
