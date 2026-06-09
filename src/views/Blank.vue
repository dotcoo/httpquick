<template>
  <div>
    <h1>Blank Page</h1>
    <hr />
    <p><button @click="toHome">home</button></p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useTab, onTabMounted, onTabActivated, onTabDeactivated, onTabBeforeUnmount } from '../../lib';

const router = useRouter();

const tab = useTab();

const toHome = async () => {
  router.replace({ name: 'Home' });
};

onTabMounted(() => {
  console.log('blank', 'onMounted');
});

onTabActivated(() => {
  console.log('blank', 'onActivated');
});

onTabDeactivated(() => {
  console.log('blank', 'onDeactivated');
});

onTabBeforeUnmount(() => {
  console.log('blank', 'onBeforeUnmount');
});
</script
