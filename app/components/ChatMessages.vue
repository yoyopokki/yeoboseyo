<template>
  <div class="chat-messages">
    <div
      v-for="message in messages"
      :key="message.id"
      :class="[
        'chat-messages__message',
        message.from === 'me'
          ? 'chat-messages__message--from-me'
          : 'chat-messages__message--from-them',
      ]"
    >
      <div class="chat-messages__message-text">
        {{ message.text }}
      </div>
      <div class="chat-messages__message-meta">
        {{ message.time }}
      </div>
    </div>

    <div
      v-if="!messages.length && !selectedUser"
      class="chat-messages__empty-state"
    >
      Выберите пользователя слева, чтобы начать переписку.
    </div>

    <div
      v-else-if="!messages.length && selectedUser"
      class="chat-messages__empty-state"
    >
      Пока нет сообщений. Напишите первое сообщение пользователю
      {{ selectedUser.name }}.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/user';
import type { Message } from '~/types/message';

defineProps<{
  messages: Message[];
  selectedUser: User | null;
}>();
</script>

<style scoped lang="scss">
.chat-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-block: 0.5rem 1rem;

  &__message {
    max-width: 70%;
    padding: 0.5rem 0.75rem;
    border-radius: 0.75rem;
    font-size: 0.9rem;
    box-shadow: var(--p-card-shadow);

    &--from-me {
      align-self: flex-end;
      background-color: var(--p-primary-100);
    }

    &--from-them {
      align-self: flex-start;
      background-color: var(--p-surface-200);
    }
  }

  &__message-text {
    word-wrap: break-word;
  }

  &__message-meta {
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: var(--p-text-muted-color);
    text-align: right;
  }

  &__empty-state {
    margin: auto;
    text-align: center;
    color: var(--p-text-muted-color);
    font-size: 0.9rem;
  }
}
</style>
