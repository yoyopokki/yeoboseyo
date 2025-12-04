<template>
  <div class="google-auth">
    <div v-if="!isAuthenticated" class="google-auth__auth">
      <h2 class="google-auth__title">Вход через Google</h2>

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

        <button type="button" class="google-auth__logout" @click="signOut">
          Выйти
        </button>
      </header>

      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, user, signOut } = useGoogleAuth();

const onLoginSuccess = (payload: unknown) => {
  // Здесь вы можете отправить токен на бэкенд или сохранить профиль пользователя в сторе
  console.log('Google login success', payload);
};

const onLoginError = (error: unknown) => {
  console.error('Google login error', error);
};
</script>

<style scoped lang="scss">
.google-auth {
  height: 100%;
  position: relative;
}

.google-auth__auth {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.google-auth__title {
  margin: 0;
  color: #ffffff;
}

.google-auth__content {
  height: 100%;
}

.google-auth__header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  color: #ffffff;
}

.google-auth__user-name {
  font-weight: 500;
}

.google-auth__logout {
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  background-color: #ef4444;
  color: #ffffff;
  cursor: pointer;
}
</style>


