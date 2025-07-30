export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive';
  avatar?: string;

  [key: string]: string | number | undefined;
}

export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
