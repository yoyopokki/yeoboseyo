import { useUserStore } from '~/stores/user';
import type { GoogleUser } from '~/stores/user';

const hydrateUserFromCookie = (): void => {
  const userStore = useUserStore();
  const userCookie = useCookie<GoogleUser | null>('googleUser');

  if (!userStore.user && userCookie.value) {
    userStore.setUser({ ...userCookie.value });
  }
};

type AuthMeta = {
  requiresAuth?: boolean;
  guestOnly?: boolean;
} | null;

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  hydrateUserFromCookie();

  const meta = (to.meta?.auth ?? null) as AuthMeta;

  const requiresAuth = meta?.requiresAuth === true;
  const guestOnly = meta?.guestOnly === true;

  if (requiresAuth && !userStore.isAuthenticated) {
    return navigateTo('/login');
  }

  if (guestOnly && userStore.isAuthenticated) {
    return navigateTo('/chat');
  }
});
