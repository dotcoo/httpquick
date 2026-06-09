<template>
  <div>
    <h1>Login Page</h1>
    <hr />
    <p><button @click="onLogin">login</button></p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const onLogin = () => {
  localStorage.setItem('token', 'dotcoo');
  router.push({ name: 'Home' });
};
</script>
