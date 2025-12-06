<template>
  <div class="google-auth">
    <div v-if="!isAuthenticated" class="google-auth__button-wrapper">
      <GoogleLoginButton
        :options="{ theme: 'filled_blue', size: 'large' }"
        @success="onLoginSuccess"
        @error="onLoginError"
      />
    </div>

    <div v-else class="google-auth__content">
      <header class="google-auth__header">
        <div class="google-auth__user">
          <span class="google-auth__user-name">
            {{ user?.name || user?.email || 'Пользователь' }}
          </span>
        </div>

        <button type="button" class="google-auth__logout" @click="onSignOut">
          Выйти
        </button>
      </header>

      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import type { GoogleUser } from '~/stores/user';

type GoogleLoginClaims = {
  sub?: string;
  email?: string | null;
  name?: string | null;
  picture?: string | null;
};

type GoogleLoginSuccessPayload = {
  credential: string;
  claims?: GoogleLoginClaims;
};

const runtimeConfig = useRuntimeConfig();

const userCookie = useCookie<GoogleUser | null>('googleUser', {
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 дней
});

const userStore = useUserStore();
const user = computed(() => userStore.user);
const isAuthenticated = computed(() => userStore.isAuthenticated);

onBeforeMount(() => {
  if (!userStore.user && userCookie.value) {
    try {
      userStore.setUser({ ...userCookie.value });
    } catch (e) {
      console.warn(e);
      userCookie.value = null;
    }
  }
});

watch(
  () => userStore.user,
  (value: GoogleUser | null) => {
    if (!value) {
      userCookie.value = null;
      return;
    }

    userCookie.value = value;
  },
  { deep: true }
);

const onLoginSuccess = async (
  payload: GoogleLoginSuccessPayload
): Promise<void> => {
  const claims = payload?.claims ?? {};

  if (!claims.sub) {
    return;
  }

  const { data, error } = await useFetch<{
    token: string;
    user: GoogleLoginClaims;
  }>(`${runtimeConfig.public.apiUrl}/auth/google/frontend`, {
    method: 'post',
    body: { id_token: payload.credential },
  });

  if (error.value || !data.value) {
    console.error(error.value);
    return;
  }

  const { token, user } = data.value;
  userStore.setUser({
    id: user.sub ?? '',
    email: user.email ?? null,
    name: user.name ?? null,
    picture: user.picture ?? null,
    token,
  });

  navigateTo('/chat');
};

const onLoginError = (error: unknown): void => {
  console.error(error);
};

const onSignOut = (): void => {
  userStore.clearUser();
  userCookie.value = null;

  navigateTo('/login');
};
</script>

<style scoped lang="scss">
.google-auth {
  height: 100%;
  position: relative;

  &__button-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }

  &__content {
    height: 100%;
  }

  &__header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    color: $color-white;
  }

  &__user-name {
    font-weight: 500;
  }

  &__logout {
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    background-color: $color-error;
    color: $color-white;
    cursor: pointer;
  }
}
</style>
