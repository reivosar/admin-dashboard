export interface TableColumn {
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

export interface TableDetails {
  table_name: string;
  columns: TableColumn[];
}

export interface SearchHeaderColumn {
  column_name: string;
  data_type: string;
  enum_labels: string | null;
}

export interface SearchTableDetails {
  headers: SearchHeaderColumn[];
  data: { [key: string]: any }[];
}
