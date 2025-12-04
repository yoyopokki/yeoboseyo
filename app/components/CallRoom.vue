<template>
  <div class="call-room">
    <div class="call-room__windows">
      <Card class="call-room__window">
        <template #title>Пользователь 1</template>
        <template #content>
          <div class="call-room__webcam-wrapper">
            <video
              ref="webcam-window-video"
              autoplay
              class="call-room__webcam"
            />
          </div>
        </template>
      </Card>
    </div>

    <div class="call-room__controls">
      <CallControlButton
        severity="secondary"
        ariaLabel="microphone"
        iconName="cil:mic"
        :is-enabled="microphoneIsEnabled"
        @click="toggleMicrophone"
      />

      <CallControlButton
        severity="secondary"
        ariaLabel="webcam"
        iconName="cil:camera"
        :is-enabled="webcamIsEnabled"
        @click="toggleWebcam"
      />

      <CallControlButton
        severity="secondary"
        ariaLabel="screen-share"
        iconName="cil:screen-desktop"
        :is-enabled="screenShareIsEnable"
        @click="toggleScreenShare"
      />

      <CallControlButton
        severity="danger"
        ariaLabel="cancel"
        iconName="cil:x"
        is-enabled
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserMedia, useDevicesList } from '@vueuse/core';

const {
  videoInputs: cameras,
  audioInputs: microphones,
  devices,
} = useDevicesList({
  requestPermissions: true,
});
const currentCamera = computed(() => cameras.value[0]?.deviceId);
const currentMicrophone = computed(() => microphones.value[0]?.deviceId);

const { stream, start } = useUserMedia({
  constraints: reactive({
    video: { deviceId: currentCamera },
    audio: { deviceId: currentMicrophone },
  }),
});
start();

const {
  stream: screenShareStream,
  start: screenShareStart,
  stop: screenShareStop,
} = useDisplayMedia();

const webcamWindowVideo = useTemplateRef('webcam-window-video');

const webcamIsEnabled = ref(false);
const microphoneIsEnabled = ref(true);
const screenShareIsEnable = ref(false);

const setVideoTrackEnabledValue = (value: boolean) => {
  const currentStream = stream.value;
  if (!currentStream) {
    return;
  }

  const currentVideoTrack = currentStream.getVideoTracks()[0];

  if (!value) {
    if (!currentVideoTrack) {
      return;
    }

    currentVideoTrack.stop();
    currentStream.removeTrack(currentVideoTrack);
    return;
  }

  if (currentVideoTrack) {
    currentVideoTrack.enabled = true;
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    return;
  }

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((newStream) => {
      const [newVideoTrack] = newStream.getVideoTracks();
      if (!newVideoTrack) {
        return;
      }

      currentStream.addTrack(newVideoTrack);
    })
    .catch((error) => {
      console.error('Failed to enable webcam', error);
    });
};

const setAudioTrackEnabledValue = (value: boolean) => {
  const videoTrack = stream.value?.getAudioTracks()[0];
  if (!videoTrack) {
    return;
  }

  videoTrack.enabled = value;
};

const toggleWebcam = () => {
  webcamIsEnabled.value = !webcamIsEnabled.value;

  setVideoTrackEnabledValue(webcamIsEnabled.value);
};

const toggleMicrophone = () => {
  microphoneIsEnabled.value = !microphoneIsEnabled.value;

  setAudioTrackEnabledValue(microphoneIsEnabled.value);
};

const toggleScreenShare = () => {
  screenShareIsEnable.value = !screenShareIsEnable.value;

  if (!screenShareIsEnable.value) {
    screenShareStop();
  } else {
    screenShareStart();
  }
};

// Как только медиапоток станет доступен, по умолчанию выключаем видео и включаем микрофон
watch(
  stream,
  () => {
    setVideoTrackEnabledValue(webcamIsEnabled.value);
    setAudioTrackEnabledValue(microphoneIsEnabled.value);
  },
  { immediate: true }
);

watchEffect(() => {
  if (!webcamWindowVideo.value) {
    return;
  }

  const sourceStream = !screenShareIsEnable.value
    ? stream.value
    : screenShareStream.value;

  if (!sourceStream) {
    return;
  }

  webcamWindowVideo.value.srcObject = sourceStream;
});
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
