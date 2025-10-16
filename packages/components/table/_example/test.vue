<template>
  <WeTable :columns="columns" :data="allData" :filter-fields="queryFields" />
</template>

<script setup lang="tsx">
import WeTable from '@wesley/components/table/table';
import { FilterField } from '../type';

const columns = [
  { title: '姓名', colKey: 'name' },
  { title: '年龄', colKey: 'age' },
  { title: '性别', colKey: 'gender' },
];

const allData = [
  { id: 1, name: '张三', age: 18, gender: 'male' },
  { id: 2, name: '李四', age: 22, gender: 'female' },
  { id: 3, name: '王五', age: 30, gender: 'male' },
];

const queryFields: FilterField[] = [
  { name: 'name', label: '姓名', type: 'input' },
  {
    name: 'gender',
    label: '性别',
    type: 'select',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
];

async function fetchData(params: any) {
  // 模拟异步请求
  const allData = [
    { id: 1, name: '张三', age: 18, gender: 'male' },
    { id: 2, name: '李四', age: 22, gender: 'female' },
    { id: 3, name: '王五', age: 30, gender: 'male' },
  ];
  let filtered = allData;
  if (params.name) {
    filtered = filtered.filter((item) => item.name.includes(params.name));
  }
  if (params.gender) {
    filtered = filtered.filter((item) => item.gender === params.gender);
  }
  const start = ((params.page || 1) - 1) * (params.pageSize || 10);
  const end = start + (params.pageSize || 10);
  return {
    data: filtered.slice(start, end),
    total: filtered.length,
  };
}
</script>

<script lang="tsx">
export default {
  name: 'PositionManage',
};
</script>
