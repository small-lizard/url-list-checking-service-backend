export interface Repository<T> {
  get(id: string): T | undefined;
  getAll(): T[];
  save(id: string, data: any): T;
}
