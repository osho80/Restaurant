export interface ITable {
  Table: number;
  Diners: number;
  Concat: number[];
}

export interface IOrder {
  Mobile: string;
  Diners: number;
}

export interface ICompleted {
  Mobile: string;
  Diners: number;
  tables: number[];
  start_time: number;
  end_time: number;
}
