export interface TableColumnModel {
  column_name: string;
  data_type: string;
  is_primary: boolean;
  is_unique: boolean;
  default_value: string | null;
  foreign_key: string | null;
  is_nullable: boolean;
  foreign_table: string | null;
  enum_labels: string | null;
}

export interface TableDetailsModel {
  table_name: string;
  columns: TableColumnModel[];
}

export interface SearchHeaderColumnModel {
  column_name: string;
  data_type: string;
  enum_labels: string | null;
}

export interface SearchTableDetailsModel {
  headers: SearchHeaderColumnModel[];
  data: { [key: string]: any }[];
}
