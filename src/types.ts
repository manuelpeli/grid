interface BaseSetting<T> {
    field?: string;
    valueGetter?: (row: T) => string | number | boolean | undefined;
    valueFormatter?: (value: any) => string | null;
    cellRenderer?: (row: T) => any;

    // cellRenderer?: (new (injector?: Injector) => ICellRenderer) | string;
    // cellRendererParams?: any;
    // width?: number;
    // cellJustify?: Justify;
    // cellStyle?: {} | ((row: any) => {});
}

export interface ColumnSetting<T> extends BaseSetting<T> {
    header?: string;
    sortable?: boolean;
    filterable?: boolean;
    onClick?: (row: T) => void;
    // headJustify?: Justify;
    // sortKey?: string;
}

export type Variant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'dark'
  | 'light';
