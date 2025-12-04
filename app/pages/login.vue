<template>
  <GoogleAuth />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  auth: {
    guestOnly: true,
  },
});
</script>


