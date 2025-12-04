<template>
  <Button
    :severity="severity"
    rounded
    :aria-label="ariaLabel"
    @click="$emit('click')"
  >
    <span
      class="call-control-button__icon"
      :class="{ 'call-control-button__icon--off': !isEnabled }"
    >
      <Icon :name="iconName" />
    </span>
  </Button>
</template>

<script setup lang="ts">
import type { ButtonProps } from 'primevue/button';

defineProps<{
  isEnabled: boolean;
  ariaLabel: string;
  severity: ButtonProps['severity'];
  iconName: string;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<style lang="scss">
.call-control-button__icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &--off {
    opacity: 0.4;

    &::after {
      content: '';
      position: absolute;
      width: 120%;
      height: 2px;
      background-color: var(--p-red-500);
      transform: rotate(-45deg);
    }
  }
}
</style>
