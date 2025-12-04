<template />

<script setup lang="ts">
definePageMeta({
  layout: 'chat',
  middleware: ['auth'],
  auth: {
    requiresAuth: true,
  },
});
</script>


