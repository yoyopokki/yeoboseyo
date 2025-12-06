<template>
  <Card class="chat-user-list">
    <template #title>Пользователи</template>
    <template #content>
      <Listbox
        v-model="internalSelectedUser"
        :options="users"
        optionLabel="name"
        class="w-full"
      >
        <template #option="slotProps">
          <div class="chat-user-list__user-item">
            <div class="chat-user-list__user-main">
              <span class="chat-user-list__user-name">
                {{ slotProps.option.name }}
              </span>
              <small
                class="chat-user-list__user-email"
                v-if="slotProps.option.email"
              >
                {{ slotProps.option.email }}
              </small>
            </div>

            <Tag
              v-if="slotProps.option.status"
              :value="
                slotProps.option.status === 'online' ? 'В сети' : 'Не в сети'
              "
              :severity="
                slotProps.option.status === 'online' ? 'success' : 'secondary'
              "
              class="chat-user-list__user-status"
            />
          </div>
        </template>
      </Listbox>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { User } from '~/types/user';

const props = defineProps<{
  users: User[];
  modelValue: User | null;
}>();
const emit = defineEmits<{
  'update:modelValue': [value: User | null];
}>();

const internalSelectedUser = computed({
  get: () => props.modelValue,
  set: (value: User | null) => {
    emit('update:modelValue', value);
  },
});
</script>

<style scoped lang="scss">
.chat-user-list {
  height: 100%;

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
}
</style>
