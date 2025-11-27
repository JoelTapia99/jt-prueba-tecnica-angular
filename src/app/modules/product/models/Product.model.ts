export interface IProduct {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: Date | null;
  date_revision: Date | null;
}
