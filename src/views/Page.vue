<template>
  <div>
    <h1>{{ route.fullPath }} Page</h1>
    <hr />
    <p><input v-model="input" /></p>
    <p style="display: flex; gap: 10px;">
      <button @click="push">router.push</button>
      <button @click="replace">router.replace</button>
      <button @click="back">router.back</button>
      <button @click="forward">router.forward</button>
    </p>
    <p style="display: flex; gap: 10px;">
      <button @click="refresh">tab.refresh</button>
      <button @click="close">tab.close</button>
    </p>
    <hr />
    <p><button @click="onLogout">logout</button></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTab, onTabMounted, onTabActivated, onTabDeactivated, onTabBeforeUnmount } from '../../lib';

const router = useRouter();
const route = useRoute();

const input = ref(null);

// Get current label bar information. 获取当前标签栏信息.
const tab = useTab();

// Open a new tab. 打开新标签.
const push = async () => {
  router.push({ name: 'Page', query: { id: Date.now() } });
};

// Replace the current label. 替换当前标签.
const replace = async () => {
  router.replace({ name: 'Page', query: { id: Date.now() } });
};

// Back. 后退.
const back = async () => {
  router.back();
};

// Forward. 前进.
const forward = async () => {
  router.forward();
};

// Refresh. 刷新.
const refresh = () => {
  tab.refresh();
};

// Close the current tag and back. 关闭当前标签并返回.
const close = () => {
  tab.close('back');
};

// When the tab is opened. 标签页打开时.
onTabMounted(() => {
  tab.title = tab.meta.title + tab.query.id;
  input.value = Math.random();
  console.log(tab.query.id, 'onMounted');
});

// When the tab is displayed. 标签页显示时.
onTabActivated(() => {
  console.log(tab.query.id, 'onActivated');
});

// When the tab is hidden. 标签页隐藏时.
onTabDeactivated(() => {
  console.log(tab.query.id, 'onDeactivated');
});

// When the tag page is destroyed. 标签页销毁时.
onTabBeforeUnmount(() => {
  console.log(tab.query.id, 'onBeforeUnmount');
});

const onLogout = () => {
  localStorage.removeItem('token');
  router.push({ name: 'Login' });
};
</script>
