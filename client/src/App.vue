<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Modal from './components/Modal.vue';
</script>

<template>
  <Modal />
  <Header />
  <RouterView />
</template>
