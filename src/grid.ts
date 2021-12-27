import {ColumnSetting as ExtColumnSetting, Variant} from './types';
import get from './utils/get';

type ColumnSetting<T> = ExtColumnSetting<T> & {id: string};
enum SortOrder {
    Asc = 'asc',
    Desc = 'desc',
}

export class Grid<T> {
    private columnSettings: ColumnSetting<T>[];
    private rows: T[];
    private el: HTMLTableElement;
    private sortBy: {
        key: ColumnSetting<T>;
        order: SortOrder;
    } | null;
    private activeFilter: string | null;

    constructor(columnSettings: ExtColumnSetting<T>[], rows: T[], getRowColor?: (row: T) => Variant) {
        this.rows = rows;
        this.columnSettings = columnSettings.map((c, index) => ({...c, id: `col_${index}`}));
        this.el = document.createElement('table');
        this.sortBy = null;
        this.activeFilter = null;
        this.generateTable(rows, getRowColor);
        this.generateTableHead();
    }

    getHTML() {
        return this.el;
    }

    private generateTableHead() {
        const thead = this.el.createTHead();
        const row = thead.insertRow();
        for (let columnSetting of this.columnSettings) {
            const th = document.createElement('th');
            const container = document.createElement('div');
            let div = document.createElement('div');
            div.classList.add('header');
            let text = document.createTextNode(columnSetting.header || '');
            div.appendChild(text);
            container.appendChild(div);
            th.appendChild(container);
            if (columnSetting.sortable) {
                div.classList.add('sortable');
                if (this.sortBy && this.sortBy.key.id === columnSetting.id) {
                    div.classList.add(this.sortBy.order === SortOrder.Asc ? 'sortedAsc' : 'sortedDesc');
                }
                div.addEventListener('click', () => this.changeSort(columnSetting));
            }
            if (columnSetting.filterable) {
                text = document.createTextNode('X');
                div = document.createElement('div');
                div.classList.add('filterIcon');
                div.appendChild(text);
                container.appendChild(div);
                div.addEventListener('click', () => this.changeFilter(columnSetting, div));
            }
            row.appendChild(th);
        }
    }

    private generateTable(rows: T[], getRowColor?: (row: T) => Variant) {
        for (let row of rows) {
            let tableRow = this.el.insertRow();
            for (let columnSetting of this.columnSettings) {
                let cell = tableRow.insertCell();

                if (columnSetting.field) {
                    const content = get(row, columnSetting.field);
                    let text = document.createTextNode(content || '');
                    cell.appendChild(text);
                } else if (columnSetting.valueGetter) {
                    const content = columnSetting.valueGetter(row);
                    let text = document.createTextNode(`${content}`);
                    cell.appendChild(text);
                } else if (columnSetting.cellRenderer) {
                    cell.appendChild(columnSetting.cellRenderer(row));
                }

                if (columnSetting.onClick) {
                    cell.style.cursor = 'pointer';
                    cell.addEventListener('click', (event) => {
                        columnSetting.onClick(row);
                    });
                }
            }

            if (getRowColor) {
                tableRow.classList.add(`table-${getRowColor(row)}`);
            }
        }
    }

    private changeSort(column: ColumnSetting<T>) {
        this.el.innerHTML = '';
        let rows = this.rows;

        if (!this.sortBy || this.sortBy.key.id !== column.id) {
            rows = [...rows].sort((a, b) => (a[column.field] > b[column.field]) ? 1 : ((b[column.field] > a[column.field]) ? -1 : 0));
            this.sortBy = {
                key: column,
                order: SortOrder.Asc,
            }
        } else if (this.sortBy.order === SortOrder.Asc) {
            rows = [...rows].sort((a, b) => (a[column.field] > b[column.field]) ? -1 : ((b[column.field] > a[column.field]) ? 1 : 0));
            this.sortBy = {
                ...this.sortBy,
                order: SortOrder.Desc,
            }
        } else {
            this.sortBy = null;
        }

        this.generateTable(rows);
        this.generateTableHead();
    }

    private changeFilter(column: ColumnSetting<T>, div: HTMLDivElement) {
        if (this.activeFilter !== column.id) {
            this.activeFilter = column.id;
            const popupDiv = document.createElement('div');
            popupDiv.classList.add('popup');
            let text = document.createTextNode('Popup');
            popupDiv.appendChild(text);

            const values = this.rows.map((row) => row[column.field]);
            for (let value of values) {
                const itemDiv = document.createElement('div');
                const itemText = document.createTextNode(value);
                itemDiv.appendChild(itemText);
                popupDiv.appendChild(itemDiv);
            }

            div.append(popupDiv);
        } else {
            this.activeFilter = null;
            const popupDiv = div.getElementsByClassName('popup')[0];
            if (popupDiv) {
                div.removeChild(popupDiv);
            }
        }
    }
}
