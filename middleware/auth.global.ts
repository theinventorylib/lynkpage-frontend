export default defineNuxtRouteMiddleware(async (to) => {
  // auth user
  const store = useAuthStore();
  const { authenticated, getUserData } = storeToRefs(store); // make authenticated state reactive

  // auth cookie
  const authCookie = useAuthCookie();
  const { accessToken, refreshToken } = authCookie; // get the token from the cookie

  if (accessToken !== null && refreshToken !== null) {
    // check if value exists
    authenticated.value = true; // update the state to authenticated
    if (!getUserData.value.username) {
      await useAsyncData(() => store.getUser(), {
        // server: true,
      });
    }
  }

  // if token exists and url is /login redirect to homepage
  if (
    (accessToken && refreshToken && to.path === "/auth/login") ||
    (accessToken && refreshToken && to.path === "/auth/signup") ||
    (accessToken && refreshToken && to.path === "/")
  ) {
    return navigateTo("/home");
  }

  // Protected paths
  // if token doesn't exist redirect to log in
  // block any path from themes/*
  if (
    (!accessToken && !refreshToken && to.path === "/home") ||
    (!accessToken && !refreshToken && to.path === "/edit") ||
    (!accessToken && !refreshToken && to.path === "/themes") ||
    (!accessToken && !refreshToken && to.path.includes("/themes/")) ||
    (!accessToken && !refreshToken && to.path.includes("/edit/"))
  ) {
    abortNavigation();
    return navigateTo("/auth/login");
  }
});
