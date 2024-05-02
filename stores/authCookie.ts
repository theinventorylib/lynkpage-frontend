// a store to manage the user cookie

export const useAuthCookie = defineStore("authtoken", {
  state: () => ({
    accessToken: null as string | null,
    refreshToken: null as string | null,
    accessExpiration: null as Date | null,
    refreshExpiration: null as Date | null,
  }),
  actions: {
    // set token
    async setTokenCookies(
      access: string,
      refresh: string,
      accessExpiration: Date,
      refreshExpiration: Date,
    ) {
      this.accessToken = access;
      this.refreshToken = refresh;
      this.accessExpiration = accessExpiration;
      this.refreshExpiration = refreshExpiration;
    },

    // remove token
    async removeTokenCookies() {
      this.accessToken = null;
      this.refreshToken = null;
      this.accessExpiration = null;
      this.refreshExpiration = null;
      // remove the cookie
      this.$state.accessExpiration = null;
      this.$state.refreshExpiration = null;
      this.$state.accessToken = null;
      this.$state.refreshToken = null;
    },
  },
  // getters
  getters: {
    getAccessToken(): string | null {
      return this.accessToken;
    },
    getRefreshToken(): string | null {
      return this.refreshToken;
    },
    getAccessExpiration(): Date | null {
      return this.accessExpiration;
    },
    getRefreshExpiration(): Date | null {
      return this.refreshExpiration;
    },
  },
  persist: {
    storage: persistedState.cookiesWithOptions({
      path: "/",
      httpOnly: false,
      sameSite: "lax",
    }),
  },
});
