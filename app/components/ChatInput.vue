<template>
  <div class="chat-input">
    <div class="chat-input__inner">
      <Textarea
        v-model="internalValue"
        rows="3"
        autoResize
        :maxlength="maxlength"
        class="chat-input__textarea"
        :placeholder="placeholder"
        @keydown.enter.exact.prevent="$emit('send')"
      />

      <Button
        class="chat-input__send-icon-button"
        @click="$emit('send')"
        rounded
        severity="primary"
      >
        <Icon name="cil:send" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  canSend: boolean;
  placeholder: string;
  maxlength?: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  send: [];
}>();

const internalValue = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    emit('update:modelValue', value);
  },
});
</script>

<style scoped lang="scss">
.chat-input {
  border-top: 1px solid var(--p-surface-200);
  padding-top: 0.75rem;

  &__inner {
    position: relative;
  }

  &__textarea {
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
