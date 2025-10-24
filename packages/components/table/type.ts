import { BaseTableCol, ButtonProps, TableProps, TableRowData } from 'tdesign-vue-next';

export type FilterFieldType = 'input' | 'select';

export type FilterFormBtnAlign = 'left' | 'right' | 'center';

export interface FilterField {
  name: string;
  label: string;
  type: FilterFieldType;
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
}

export interface WesleyTableProps<T extends TableRowData = TableRowData> {
  // 表格头
  columns: Array<BaseTableCol<T>>;
  // 表格数据
  data: Array<T>;
  // 表格筛选配置
  filterFields: FilterField[];
  // margin
  needMargin: boolean;
  // query-btn
  queryBtn: boolean | ButtonProps;
  // reset-btn
  resetBtn: boolean | ButtonProps;
  // btn-group align
  btnAlign: FilterFormBtnAlign;
  // 透传td表格
  tableProps: TableProps;
  // useSlot
  useSlot: boolean;
  // 点击查询回调
  onFilter: (filters: any) => WesleyTableProps<T>['data'];
}
