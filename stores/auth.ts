// importing types
import type { UserInterface } from "../types/index.d";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {} as UserInterface | UserInterface,
    authenticated: false,
    loading: false,
  }),
  actions: {
    async authenticateUser({ username, password }: UserPayloadInterface) {
      // useFetch from nuxt 3
      // using useFetch outside of a vue page or component will cause a warning
      const { data, pending } = await useFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          username,
          password,
        },
        // server: true,
      });
      this.loading = pending.value;

      if (data.value) {
        // set the token expiry from the data
        const tokenExpiry = new Date(data?.value?.access_expiration);
        // get the refresh token expiry from the data
        const refreshTokenExpiry = new Date(data?.value?.refresh_expiration);
        // get the access token from the data
        const accessToken = data?.value?.access;
        // get the refresh token from the data
        const refreshToken = data?.value?.refresh;
        // final token
        const authCookie = useAuthCookie();
        await authCookie.setTokenCookies(
          accessToken,
          refreshToken,
          tokenExpiry,
          refreshTokenExpiry,
        );
        this.authenticated = true; // set authenticated  state value to true
        // set the user data
        this.user = data.value?.user;
      }
    },
    async logUserOut(deleteAccount: boolean = false) {
      if (deleteAccount == true) {
        this.authenticated = false; // set authenticated  state value to false
        const authCookie = useAuthCookie();
        await authCookie.removeTokenCookies();
        // reset the state
        this.user = {} as UserInterface;
      } else {
        const result = await $fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // server: true,
        });
        if (result) {
          // const token = useCookie("auth_token"); // useCookie new hook in nuxt 3
          // reset the state
          this.user = {} as UserInterface;
          this.authenticated = false; // set authenticated  state value to false
          const authCookie = useAuthCookie();
          await authCookie.removeTokenCookies();
        }
      }
    },
    //  getUser
    async getUser() {
      // check if the state is already set
      if (this.user && this.user.username) {
        return;
      }
      // useFetch from nuxt 3
      // using useFetch outside of a vue page or component will cause a warning
      const { data, pending } = await useFetch("/api/getUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // server: true,
      });
      this.loading = pending.value;

      if (data.value) {
        // set the user data
        this.user = data.value;
        // console.log("user called");
      }
    },
    // update user
    async updateUser(payload: UserInterface) {
      // set the user data
      this.user = payload;
      // console.log("user called");
    },
    // updating counts
    handleCount(which: string) {
      // category
      if (this.user) {
        if (which === "categoryAdd") {
          this.user.category_count -= 1;
        } else if (which === "categoryDelete") {
          this.user.category_count += 1;
        }
      }

      // socail links
      if (this.user) {
        if (which === "socialLinkAdd") {
          this.user.social_link_count -= 1;
        } else if (which === "socialLinkDelete") {
          this.user.social_link_count += 1;
        }
      }

      // skills
      if (this.user) {
        if (which === "skillAdd") {
          this.user.skill_count -= 1;
        } else if (which === "skillDelete") {
          this.user.skill_count += 1;
        }
      }

      // item
      if (this.user) {
        if (which === "itemAdd") {
          this.user.item_count -= 1;
        } else if (which === "itemDelete") {
          this.user.item_count += 1;
        }
      }
    },
  },
  // getters
  getters: {
    // get the user data
    getUserData(): UserInterface {
      return this.user;
    },
    // get the authenticated state
    getAuthenticatedState(): boolean {
      return this.authenticated;
    },
    // get the loading state
    getLoadingState(): boolean {
      return this.loading;
    },
  },
  // hydration
  // hydrate: (state, initialState) => {
  //   // get the state from the session storage
  //   // state.user = useSessionStorage("auth", initialState.user);
  // },

  persist: {
    storage: persistedState.sessionStorage,
  },
});
