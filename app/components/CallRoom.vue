<template>
  <div class="call-room">
    <div class="call-room__windows">
      <Card class="call-room__window">
        <template #content>
          <video ref="webcam-window-video" autoplay class="call-roow__webcam" />
        </template>
      </Card>
    </div>

    <div class="call-room__controls">
      <Button severity="secondary" rounded aria-label="microphone">
        <Icon name="cil:mic" />
      </Button>

      <Button severity="secondary" rounded aria-label="webcam">
        <Icon name="cil:camera" />
      </Button>

      <Button severity="danger" rounded aria-label="cancel">
        <Icon name="cil:x" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserMedia, useDevicesList } from '@vueuse/core'

const {
  videoInputs: cameras,
  audioInputs: microphones,
} = useDevicesList({
  requestPermissions: true,
})
const currentCamera = computed(() => cameras.value[0]?.deviceId)
const currentMicrophone = computed(() => microphones.value[0]?.deviceId)

const { stream, start } = useUserMedia({
  constraints: reactive({
    video: { deviceId: currentCamera },
    audio: { deviceId: currentMicrophone, }
  })
})
start()

const webcamWindowVideo = useTemplateRef('webcam-window-video')

watchEffect(() => {
  if (!webcamWindowVideo.value || !stream.value) {
    return
  }

  webcamWindowVideo.value.srcObject = stream.value
})
</script>

<style lang="scss">
.call-room {
  height: 100%;

  & &__controls {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 15px 0;
  }

  & &__windows {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 64px;
  }

  & &__window {
    width: max-content;
  }

  & &__webcam {
    width: 500px;
    height: auto;
  }
}
</style>