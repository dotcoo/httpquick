<template>
  <div>
    <ul>
      <li v-for="(v, i) in list" :key="v.id">{{v.username}}</li>
    </ul>
    <button @click="onPostJson">请求</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const total = ref(0);
const list = ref([]);

const onPostJson = async () => {
  const json = { pageNum: 1, pageSize: 5 };
  const res = await httpPost({ url: '/postJson.json', json, headers: { a: 1 } });
  if (res.body.errno != 0) { return; }
  total.value = res.body.total;
  list.value = res.body.list;
};
</script>
