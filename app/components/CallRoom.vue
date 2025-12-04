<template>
  <div class="call-room">
    <div class="call-room__windows">
      <Card class="call-room__window">
        <template #title>
          {{ localUser?.name || 'Вы' }}
        </template>
        <template #content>
          <div class="call-room__webcam-wrapper">
            <video
              ref="webcam-window-video"
              autoplay
              class="call-room__webcam"
            />

            <div class="call-room__avatar">
              <div class="call-room__avatar-circle">
                <img
                  v-if="localUser?.picture"
                  :src="localUser.picture"
                  alt="Ваш аватар"
                  class="call-room__avatar-image"
                />
                <span v-else class="call-room__avatar-initials">
                  {{ getInitial(localUser?.name, 'Вы') }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card class="call-room__window">
        <template #title>
          {{ remoteUser?.name || 'Собеседник' }}
        </template>
        <template #content>
          <div
            class="call-room__webcam-wrapper call-room__webcam-wrapper--remote"
          >
            <div class="call-room__avatar">
              <div class="call-room__avatar-circle">
                <span class="call-room__avatar-initials">
                  {{ getInitial(remoteUser?.name, 'Собеседник') }}
                </span>
              </div>
            </div>
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
        @click="$emit('close')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserMedia, useDevicesList } from '@vueuse/core';

type UserStatus = 'online' | 'offline';

interface CallRoomUser {
  id: string | number;
  name: string | null;
  email?: string | null;
  picture?: string | null;
  status?: UserStatus;
}

defineProps<{
  localUser: CallRoomUser | null;
  remoteUser: CallRoomUser | null;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

const getInitial = (
  name: string | null | undefined,
  fallback: string
): string => {
  const base = name && name.trim().length > 0 ? name.trim() : fallback;
  return base.charAt(0).toUpperCase();
};

const { videoInputs: cameras, audioInputs: microphones } = useDevicesList({
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

const webcamWindowVideo = useTemplateRef<HTMLVideoElement | null>(
  'webcam-window-video'
);

const webcamIsEnabled = ref<boolean>(false);
const microphoneIsEnabled = ref<boolean>(true);
const screenShareIsEnable = ref<boolean>(false);

const setVideoTrackEnabledValue = (value: boolean): void => {
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

const setAudioTrackEnabledValue = (value: boolean): void => {
  const videoTrack = stream.value?.getAudioTracks()[0];
  if (!videoTrack) {
    return;
  }

  videoTrack.enabled = value;
};

const toggleWebcam = (): void => {
  webcamIsEnabled.value = !webcamIsEnabled.value;

  setVideoTrackEnabledValue(webcamIsEnabled.value);
};

const toggleMicrophone = (): void => {
  microphoneIsEnabled.value = !microphoneIsEnabled.value;

  setAudioTrackEnabledValue(microphoneIsEnabled.value);
};

const toggleScreenShare = (): void => {
  screenShareIsEnable.value = !screenShareIsEnable.value;

  if (!screenShareIsEnable.value) {
    screenShareStop();
    setVideoTrackEnabledValue(webcamIsEnabled.value);
  } else {
    setVideoTrackEnabledValue(false);
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
  width: 100%;
  height: 100%;
  background-color: var(--p-slate-900);
  font-family:
    'Roboto',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;

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
    gap: 24px;
    padding-bottom: 64px;
  }

  & &__window {
    width: max-content;
    max-width: 460px;
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
    position: relative;
  }

  & &__placeholder {
    color: #e5e7eb;
    font-size: 0.9rem;
    text-align: center;
    opacity: 0.8;
  }

  & &__avatar {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  & &__avatar-circle {
    width: 96px;
    height: 96px;
    border-radius: 9999px;
    background-color: #1e293b;
    border: 2px solid rgba(148, 163, 184, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & &__avatar-image {
    width: 100%;
    height: 100%;
    border-radius: inherit;
    object-fit: cover;
    display: block;
  }

  & &__avatar-initials {
    color: #e5e7eb;
    font-weight: 600;
    font-size: 2rem;
    text-transform: uppercase;
  }
}
</style>
