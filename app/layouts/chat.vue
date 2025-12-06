<template>
  <div class="chat-page">
    <GoogleAuth>
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

        <!-- Оверлей с окном звонка -->
        <Teleport to="body">
          <div v-if="isCallRoomOpen" class="call-room-overlay">
            <div class="call-room-overlay__backdrop" @click="closeCallRoom" />
            <div class="call-room-overlay__content">
              <CallRoom
                @close="closeCallRoom"
                :local-user="localCallUser"
                :remote-user="remoteCallUser"
              />
            </div>
          </div>
        </Teleport>
      </div>
    </GoogleAuth>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUserStore } from '~/stores/user';
import type { User, CallRoomUser } from '~/types/user';
import type { Message } from '~/types/message';

const userStore = useUserStore();

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

const isCallRoomOpen = ref(false);

const localCallUser = computed<CallRoomUser | null>(() => {
  if (!userStore.user) {
    return null;
  }

  return {
    id: userStore.user.id,
    name: userStore.user.name,
    email: userStore.user.email,
    picture: userStore.user.picture,
    status: 'online',
  };
});

const remoteCallUser = computed<CallRoomUser | null>(() => {
  if (!selectedUser.value) {
    return null;
  }

  return {
    id: selectedUser.value.id,
    name: selectedUser.value.name,
    email: selectedUser.value.email ?? null,
    status: selectedUser.value.status,
  };
});

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

  // Здесь при необходимости можно добавить логику инициализации звонка
  // между userStore.user (текущий пользователь) и selectedUser.value.
  isCallRoomOpen.value = true;
};

const closeCallRoom = (): void => {
  isCallRoomOpen.value = false;
};
</script>

<style scoped lang="scss">
.chat-page {
  height: 100vh;
}

.chat-page :deep(.google-auth__header) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: $color-white;
  color: var(--p-text-color, $color-text-primary);
  box-shadow: 0 1px 2px $color-background-overlay-light;
}

.chat-layout {
  height: 100vh;
  padding-top: 56px; // отступ, чтобы шапка дашборда не перекрывала чат
  background-color: var(--p-surface-100);

  &__splitter {
    height: 100%;
  }

  &__sidebar {
    padding: 1rem;
    background-color: var(--p-surface-0);
    border-right: 1px solid var(--p-surface-200);
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

  &__content {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    gap: 0.75rem;
  }
}

.call-room-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.call-room-overlay__backdrop {
  position: absolute;
  inset: 0;
  background-color: $color-background-overlay;
}

.call-room-overlay__content {
  position: relative;
  width: 90vw;
  max-width: 1000px;
  height: 80vh;
  max-height: 680px;
  box-shadow: 0 25px 50px -12px $color-background-overlay-medium;
  border-radius: 1rem;
  overflow: hidden;
}
</style>
