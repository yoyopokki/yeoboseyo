<template>
  <div class="call-room">
    <div class="call-room__windows">
      <Card class="call-room__window">
        <template #title>Пользователь 1</template>
        <template #content>
          <div class="call-room__webcam-wrapper">
            <video ref="webcam-window-video" autoplay class="call-room__webcam" />
          </div>
        </template>
      </Card>
    </div>

    <div class="call-room__controls">
      <Button severity="secondary" rounded aria-label="microphone" @click="toggleMicrophone">
        <Icon name="cil:mic" />
      </Button>

      <Button severity="secondary" rounded aria-label="webcam" @click="toggleWebcam">
        <Icon name="cil:camera" />
      </Button>

      <Button severity="secondary" rounded aria-label="screen-share" @click="toggleScreenShare">
        <Icon name="cil:screen-desktop" />
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
  devices,
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

const {
  stream: screenShareStream,
  start: screenShareStart,
  stop: screenShareStop
} = useDisplayMedia()

const webcamWindowVideo = useTemplateRef('webcam-window-video')

const webcamIsEnabled = ref(false)
const microphoneIsEnabled = ref(false)
const screenShareIsEnable = ref(false)

const setVideoTrackEnabledValue = (value: boolean) => {
  const videoTrack = stream.value?.getVideoTracks()[0]
  if (!videoTrack) {
    return
  }

  videoTrack.enabled = value
}

const setAudioTrackEnabledValue = (value: boolean) => {
  const videoTrack = stream.value?.getAudioTracks()[0]
  if (!videoTrack) {
    return
  }

  videoTrack.enabled = value
}

const toggleWebcam = () => {
  webcamIsEnabled.value = !webcamIsEnabled.value

  setVideoTrackEnabledValue(webcamIsEnabled.value)
}

const toggleMicrophone = () => {
  microphoneIsEnabled.value = !microphoneIsEnabled.value

  setAudioTrackEnabledValue(microphoneIsEnabled.value)
}

const toggleScreenShare = () => {
  screenShareIsEnable.value = !screenShareIsEnable.value

  if (!screenShareIsEnable.value) {
    screenShareStop()
  } else {
    screenShareStart()
  }
}

watchEffect(() => {
  if (!webcamWindowVideo.value) {
    return
  }

  if (!screenShareIsEnable.value) {
    webcamWindowVideo.value.srcObject = stream.value!
  } else {
    webcamWindowVideo.value.srcObject = screenShareStream.value!
  }

  setVideoTrackEnabledValue(false)
  setAudioTrackEnabledValue(false)
})
</script>

<style lang="scss">
.call-room {
  height: 100%;
  background-color: var(--p-slate-900);

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
    width: 100%;
    height: auto;
  }

  & &__webcam-wrapper {
    width: 400px;
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>