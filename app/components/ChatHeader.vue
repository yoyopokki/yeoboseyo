<template>
  <div class="chat-header">
    <div class="chat-header__info">
      <div class="chat-header__title">
        {{ selectedUser?.name || 'Выберите пользователя' }}
      </div>
      <div v-if="selectedUser" class="chat-header__subtitle">
        {{ selectedUser.status === 'online' ? 'В сети' : 'Не в сети' }}
      </div>
    </div>

    <CallControlButton
      v-if="selectedUser"
      severity="success"
      ariaLabel="Позвонить пользователю"
      iconName="cil:phone"
      :is-enabled="true"
      @click="$emit('call')"
    />
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/user';

defineProps<{
  selectedUser: User | null;
}>();

defineEmits<{
  (e: 'call'): void;
}>();
</script>

<style scoped lang="scss">
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  &__title {
    font-weight: 600;
    font-size: 1.05rem;
  }

  &__subtitle {
    font-size: 0.85rem;
    color: var(--p-text-muted-color);
  }
}
</style>
