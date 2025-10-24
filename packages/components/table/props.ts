import { WesleyTableProps } from './type';
import { PropType } from 'vue';

export default {
  // 表格头
  columns: {
    type: Array as PropType<WesleyTableProps['columns']>,
    default: (): WesleyTableProps['columns'] => [],
  },
  // 表格数据
  data: {
    type: Array as PropType<WesleyTableProps['data']>,
    default: (): WesleyTableProps['data'] => [],
  },
  // 表格筛选配置
  filterFields: {
    type: Array as PropType<WesleyTableProps['filterFields']>,
    default: (): WesleyTableProps['filterFields'] => [],
  },
  // margin
  needMargin: {
    type: Boolean,
    default: true,
  },
  // query-btn
  queryBtn: {
    type: [Boolean, Object] as PropType<WesleyTableProps['queryBtn']>,
  },
  // reset-btn
  resetBtn: {
    type: [Boolean, Object] as PropType<WesleyTableProps['resetBtn']>,
  },
  btnAlign: {
    type: String as PropType<WesleyTableProps['btnAlign']>,
    default: 'left' as WesleyTableProps['btnAlign'],
  },
  // 透传td表格
  tableProps: {
    type: Object as PropType<WesleyTableProps['tableProps']>,
  },
  useSlot: {
    type: Boolean,
    default: false,
  },
  // 点击查询回调
  onFilter: Function as PropType<WesleyTableProps['onFilter']>,
};
