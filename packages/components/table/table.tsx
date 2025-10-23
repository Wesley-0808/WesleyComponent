import { defineComponent, ref, reactive, watch, toRefs } from 'vue';
import { Table, Form, FormItem, Input, Select, Button, Space } from 'tdesign-vue-next';
import { VNode } from 'vue';
import tableProps from './props';
import { FilterField, WesleyTableProps } from './type';
import { useEventForward } from '@wesley/hooks';

const componentName = 'wesley-table';

export default defineComponent({
  name: 'WeTable',
  props: {
    ...tableProps,
  },
  setup(props) {
    const { columns, filterFields } = toRefs(props);

    const queryForm = reactive<Record<string, any>>({});
    const loading = ref(false);
    const tableData = ref<WesleyTableProps['data']>([]);

    const pagination = reactive({
      current: 1,
      pageSize: 20,
      pageSizeOptions: [20, 40, 60, 80],
      total: props.data?.length,
    });

    const renderQueryBtn = () => {
      const buttonEvents = useEventForward(props.queryBtn, {
        onClick: handleFilterBtnClick,
      });
      if (props.queryBtn) {
        return (
          <Button theme="primary" {...buttonEvents}>
            查询
          </Button>
        );
      }
      return (
        <Button
          theme="primary"
          onClick={handleFilterBtnClick}
          {...(typeof props.queryBtn === 'object' ? props.queryBtn : {})}
        >
          查询
        </Button>
      );
    };

    const renderResetBtn = () => {
      const buttonEvents = useEventForward(props.resetBtn, {
        onClick: handleResetBtnClick,
      });
      if (props.resetBtn) {
        return (
          <Button theme="default" {...buttonEvents}>
            重置
          </Button>
        );
      }
      return (
        <Button theme="default" onClick={handleResetBtnClick}>
          重置
        </Button>
      );
    };

    const handleFilterBtnClick = () => {
      if (props.onFilter) {
        props.onFilter?.({ ...queryForm });
      } else {
        tableData.value = props.data?.filter((item) => {
          let isMatch = true;
          Object.keys(queryForm).forEach((key) => {
            if (queryForm[key].type === 'select') {
              if (queryForm[key].value && item[key] !== queryForm[key].value) {
                isMatch = false;
              }
            } else if (queryForm[key].type === 'input') {
              if (queryForm[key].value && !item[key]?.includes(queryForm[key].value)) {
                isMatch = false;
              }
            }
          });
          return isMatch;
        });
        pagination.total = tableData.value.length;
        pagination.current = 1;
      }
    };

    const handleResetBtnClick = () => {
      filterFields.value.map((field: FilterField) => {
        queryForm[field.name] = '';
      });
    };

    const renderFilterForm = () => {
      const formItems: VNode[] = [];

      filterFields.value.map((field: FilterField) => {
        if (!queryForm[field.name]) {
          queryForm[field.name] = {
            value: '',
            type: field.type,
          };
        }

        formItems.push(
          <FormItem label={field.label} name={field.name} key={field.name}>
            {field.type === 'select' ? (
              <Select
                v-model={queryForm[field.name].value as any}
                options={field.options as Array<{ label: string; value: any }>}
                placeholder={field.placeholder || '请选择' + field.label}
                style="min-width: 120px;"
              />
            ) : (
              <Input
                v-model={queryForm[field.name].value as any}
                placeholder={field.placeholder || '请输入' + field.label}
                style="min-width: 120px;"
              />
            )}
          </FormItem>,
        );
      });

      return (
        <div
          class={[componentName + `-filter_form`, { [componentName + '-filter_form--no-margin']: !props.needMargin }]}
        >
          <Form layout="inline" labelAlign="left">
            <Space>{formItems}</Space>
          </Form>

          <Space
            class={[componentName + '-filter_form-btn', `${componentName}-filter_form-btn--${props.btnAlign}`]}
            size="small"
          >
            {renderQueryBtn()}
            {renderResetBtn()}
          </Space>
        </div>
      );
    };

    const handleTablePageChange = (current: number, pageSize: number) => {
      pagination.current = current;
      pagination.pageSize = pageSize;
    };

    watch(
      () => props.data,
      (val) => {
        tableData.value = val;
        pagination.total = val?.length;
      },
      { immediate: true },
    );

    return () => {
      return (
        <>
          {renderFilterForm()}
          <Table
            class={[componentName, { [componentName + '--no-margin']: !props.needMargin }]}
            columns={columns.value}
            data={tableData.value}
            pagination={pagination}
            loading={loading.value}
            rowKey="id"
            onPageChange={({ current, pageSize }: { current: number; pageSize: number }) => {
              handleTablePageChange(current, pageSize);
            }}
          />
        </>
      );
    };
  },
});
