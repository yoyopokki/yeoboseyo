<template>
  <div class="chat-layout__input">
    <div class="chat-layout__input-inner">
      <Textarea
        v-model="internalValue"
        rows="3"
        autoResize
        :maxlength="maxlength"
        class="chat-layout__input-textarea"
        :placeholder="placeholder"
        @keydown.enter.exact.prevent="$emit('send')"
      />

      <Button
        class="chat-layout__send-icon-button"
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
