export interface IPaginatedResponse<T> {
  data: T;
  totalpages: number;
  page: number;
  totalItems: number;
}
