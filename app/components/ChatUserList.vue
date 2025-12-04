<template>
  <Card class="chat-layout__sidebar-card">
    <template #title>Пользователи</template>
    <template #content>
      <Listbox
        v-model="internalSelectedUser"
        :options="users"
        optionLabel="name"
        class="w-full"
      >
        <template #option="slotProps">
          <div class="chat-layout__user-item">
            <div class="chat-layout__user-main">
              <span class="chat-layout__user-name">
                {{ slotProps.option.name }}
              </span>
              <small
                class="chat-layout__user-email"
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
              class="chat-layout__user-status"
            />
          </div>
        </template>
      </Listbox>
    </template>
  </Card>
</template>

<script setup lang="ts">
type UserStatus = 'online' | 'offline';

interface User {
  id: number;
  name: string;
  email?: string;
  status?: UserStatus;
}

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


