<template>
  <div class="chat-layout">
    <Splitter
      class="chat-layout__splitter"
      style="height: 100vh"
      :gutterSize="4"
    >
      <!-- Левая колонка: список пользователей -->
      <SplitterPanel :size="30" :minSize="20" class="chat-layout__sidebar">
        <ChatUserList v-model="selectedUser" :users="users" />
      </SplitterPanel>

      <!-- Правая колонка: чат + кнопка звонка -->
      <SplitterPanel :size="70" :minSize="40" class="chat-layout__main">
        <Card class="chat-layout__chat-card">
          <template #title>
            <ChatHeader
              :selected-user="selectedUser"
              @call="callSelectedUser"
            />
          </template>

          <template #content>
            <div class="chat-layout__content">
              <ChatMessages
                :messages="messages"
                :selected-user="selectedUser"
              />

              <ChatInput
                v-model="newMessage"
                :can-send="canSend"
                :maxlength="1000"
                :placeholder="
                  selectedUser
                    ? 'Напишите сообщение...'
                    : 'Выберите пользователя, чтобы написать сообщение'
                "
                @send="sendMessage"
              />
            </div>
          </template>
        </Card>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type UserStatus = 'online' | 'offline';

interface User {
  id: number;
  name: string;
  email?: string;
  status?: UserStatus;
}

type MessageAuthor = 'me' | 'them';

interface Message {
  id: number;
  userId: number;
  text: string;
  time: string;
  from: MessageAuthor;
}

const users = ref<User[]>([
  {
    id: 1,
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    status: 'online',
  },
  {
    id: 2,
    name: 'Анна Смирнова',
    email: 'anna@example.com',
    status: 'offline',
  },
  {
    id: 3,
    name: 'Петр Петров',
    email: 'petr@example.com',
    status: 'online',
  },
]);

const selectedUser = ref<User | null>(users.value[0] ?? null);

const allMessages = ref<Message[]>([
  {
    id: 1,
    userId: 1,
    text: 'Привет! Как дела?',
    time: '10:15',
    from: 'them',
  },
  {
    id: 2,
    userId: 1,
    text: 'Все хорошо, спасибо! Готов к созвону.',
    time: '10:16',
    from: 'me',
  },
]);

const newMessage = ref('');

const messages = computed<Message[]>(() => {
  if (!selectedUser.value) {
    return [];
  }

  return allMessages.value.filter(
    (message) => message.userId === selectedUser.value?.id
  );
});

const canSend = computed<boolean>(() => {
  return !!selectedUser.value && !!newMessage.value.trim();
});

const sendMessage = (): void => {
  if (!canSend.value || !selectedUser.value) {
    return;
  }

  allMessages.value.push({
    id: Date.now(),
    userId: selectedUser.value.id,
    text: newMessage.value.trim(),
    time: new Date().toLocaleTimeString().slice(0, 5),
    from: 'me',
  });

  newMessage.value = '';
};

const callSelectedUser = (): void => {
  if (!selectedUser.value) {
    return;
  }
};
</script>

<style lang="scss">
.chat-layout {
  height: 100vh;
  background-color: var(--p-surface-100);

  &__splitter {
    height: 100%;
  }

  &__sidebar {
    padding: 1rem;
    background-color: var(--p-surface-0);
    border-right: 1px solid var(--p-surface-200);
  }

  &__sidebar-card {
    height: 100%;
  }

  &__user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    padding-block: 0.25rem;
  }

  &__user-main {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  &__user-name {
    font-weight: 600;
  }

  &__user-email {
    font-size: 0.8rem;
    color: var(--p-text-muted-color);
  }

  &__user-status {
    white-space: nowrap;
  }

  &__main {
    padding: 1rem;
    background-color: var(--p-surface-50);
  }

  &__chat-card {
    height: 100%;
    display: flex;
    flex-direction: column;

    .p-card-body {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }

    .p-card-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  &__header-info {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  &__header-title {
    font-weight: 600;
    font-size: 1.05rem;
  }

  &__header-subtitle {
    font-size: 0.85rem;
    color: var(--p-text-muted-color);
  }

  &__content {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    gap: 0.75rem;
  }

  &__messages {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-block: 0.5rem 1rem;
  }

  &__message {
    max-width: 70%;
    padding: 0.5rem 0.75rem;
    border-radius: 0.75rem;
    font-size: 0.9rem;
    box-shadow: var(--p-card-shadow);
  }

  &__message--from-me {
    align-self: flex-end;
    background-color: var(--p-primary-100);
  }

  &__message--from-them {
    align-self: flex-start;
    background-color: var(--p-surface-200);
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

  &__input {
    border-top: 1px solid var(--p-surface-200);
    padding-top: 0.75rem;
  }

  &__input-inner {
    position: relative;
  }

  &__input-textarea {
    width: 100%;
    padding-right: 2.75rem; // место под иконку отправки
  }

  &__send-icon-button {
    position: absolute;
    top: 50%;
    right: 0.75rem;
    transform: translateY(-50%);
    width: 2.25rem;
    height: 2.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
