<template>
  <div class="chat-layout__messages">
    <div
      v-for="message in messages"
      :key="message.id"
      :class="[
        'chat-layout__message',
        message.from === 'me'
          ? 'chat-layout__message--from-me'
          : 'chat-layout__message--from-them',
      ]"
    >
      <div class="chat-layout__message-text">
        {{ message.text }}
      </div>
      <div class="chat-layout__message-meta">
        {{ message.time }}
      </div>
    </div>

    <div
      v-if="!messages.length && !selectedUser"
      class="chat-layout__empty-state"
    >
      Выберите пользователя слева, чтобы начать переписку.
    </div>

    <div
      v-else-if="!messages.length && selectedUser"
      class="chat-layout__empty-state"
    >
      Пока нет сообщений. Напишите первое сообщение пользователю
      {{ selectedUser.name }}.
    </div>
  </div>
</template>

<script setup lang="ts">
type UserStatus = 'online' | 'offline';
type MessageAuthor = 'me' | 'them';

interface User {
  id: number;
  name: string;
  email?: string;
  status?: UserStatus;
}

interface Message {
  id: number;
  userId: number;
  text: string;
  time: string;
  from: MessageAuthor;
}

defineProps<{
  messages: Message[];
  selectedUser: User | null;
}>();
</script>


