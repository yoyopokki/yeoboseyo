<template>
  <div class="chat-layout__header">
    <div class="chat-layout__header-info">
      <div class="chat-layout__header-title">
        {{ selectedUser?.name || 'Выберите пользователя' }}
      </div>
      <div v-if="selectedUser" class="chat-layout__header-subtitle">
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
type UserStatus = 'online' | 'offline';

interface User {
  id: number;
  name: string;
  email?: string;
  status?: UserStatus;
}

defineProps<{
  selectedUser: User | null;
}>();

defineEmits<{
  (e: 'call'): void;
}>();
</script>


