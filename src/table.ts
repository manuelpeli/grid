import { Grid } from './grid';
import { ColumnSetting, Variant } from './types';

export function buildTable<T>(columnSettings: ColumnSetting<T>[], rows: T[], getRowColor?: (row: T) => Variant) {
    const grid = new Grid(columnSettings, rows, getRowColor);
    return grid.getHTML();
}