export type GoogleUser = {
  id: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  token: string;
};

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as GoogleUser | null,
  }),

  getters: {
    isAuthenticated: (state) => state.user !== null,
  },

  actions: {
    setUser(payload: GoogleUser) {
      this.user = payload;
    },

    clearUser() {
      this.user = null;
    },
  },
});


