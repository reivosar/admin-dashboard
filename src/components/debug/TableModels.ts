export type TableColumn = {
  column_name: string;
  data_type: string;
};

export type TableDetails = {
  headers: TableColumn[];
  data: { [key: string]: any }[];
};
