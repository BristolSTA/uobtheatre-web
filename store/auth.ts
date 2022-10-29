import { defineStore } from 'pinia';
import cookie from 'js-cookie';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import {
  useLoginMutationMutation,
  useRefreshTokenMutationMutation,
  LoadUserDetailsDocument,
  AuthUserDetailsFragment,
  LoadUserDetailsQuery,
  useRequestPasswordResetMutationMutation,
  useResetPasswordMutationMutation,
  useActiveAccountMutationMutation,
  useRegisterUserMutationMutation
} from '@/graphql/codegen/operations';
import Errors from '~~/classes/Errors';
import ValidationError from '~~/errors/ValidationError';
import UnverifiedLoginError from '~~/errors/auth/UnverifiedLoginError';

let refreshTimer;

export const useStore = defineStore('auth', {
  state: () => ({
    token: null as string,
    user: null as AuthUserDetailsFragment
  }),
  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user
  },
  actions: {
    setAuthUser(userDetails: AuthUserDetailsFragment) {
      this.user.value = userDetails;
    },
    async loadUserDetails(userDetails: AuthUserDetailsFragment = undefined) {
      if (!userDetails) {
        const { data } = await useAsyncQuery<LoadUserDetailsQuery>(
          LoadUserDetailsDocument,
          {
            fetchPolicy: 'no-cache'
          }
        );
        userDetails = data.value.me;
      }
      if (!userDetails) {
        return this.logout();
      }

      this.user = userDetails;
    },
    /**
     * Attempt to login the user with the provided details
     *
     * @param email The user's email
     * @param password The user's password
     * @param remember Whether the user would like to be remembered on this device
     */
    async login(email: string, password: string, remember: boolean) {
      const { mutate } = useLoginMutationMutation({
        variables: { email, password }
      });

      const { data } = await mutate();

      if (!data.login.success) {
        throw new ValidationError(Errors.createFromAPI(data.login.errors));
      }

      if (!data.login.user.verified) {
        throw new UnverifiedLoginError();
      }

      // Store the auth token & tell Apollo about our shiny new token
      this.token = data.login.token;
      const { onLogin } = useApollo();
      await onLogin(this.token);
      // Store the fresh token
      this.setRefreshToken(data.login.refreshToken, remember);
      // Start queing a token refresh
      this.queueRefresh();
      // Load user details
      await this.loadUserDetails();
    },
    async refreshUsingToken() {
      if (!this.getRefreshToken()) return this.logout();

      const { mutate } = useRefreshTokenMutationMutation({
        variables: {
          refreshToken: this.getRefreshToken()
        }
      });

      const { data } = await mutate();

      if (!data.refreshToken.token) {
        return this.logout();
      }

      this.token = data.refreshToken.token;
      this.setRefreshToken(data.refreshToken.refreshToken);
      this.queueRefresh(data.refreshToken.token);

      return this.loadUserDetails();
    },
    queueRefresh() {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
      const { exp } = jwtDecode<JwtPayload>(this.token);
      let timeoutSeconds = exp - Math.round(Date.now() / 1000) - 30;

      if (timeoutSeconds < 1) {
        timeoutSeconds = 1;
      }

      refreshTimer = setTimeout(() => {
        refreshTimer = null;
        this.refreshUsingToken();
      }, timeoutSeconds * 1000);
    },
    /**
     * Stores the given refresh token, taking into account device-user remembering preference
     *
     * @param refreshToken The refresh token
     * @param remember Whether the user should be remembered on thsi device
     */
    setRefreshToken(refreshToken: string, remember: boolean = undefined) {
      const runtimeConfig = useRuntimeConfig();
      const rememberLengthDays = 365;
      if (remember) {
        cookie.set(runtimeConfig.public.auth.rememberKey, true, {
          expires: remember ? rememberLengthDays : null
        });
      } else if (
        remember === false &&
        cookie.get(runtimeConfig.public.auth.rememberKey)
      ) {
        cookie.remove(runtimeConfig.public.auth.rememberKey);
      }

      cookie.set(runtimeConfig.public.auth.refreshTokenKey, refreshToken, {
        expires: this.isRemembering() ? rememberLengthDays : null
      });
    },
    async logout(broadcast = true) {
      const runtimeConfig = useRuntimeConfig();

      // Wipe store
      this.user = null;
      this.token = null;

      // Clear refresh timeout
      clearTimeout(refreshTimer);

      // Remove cookies
      cookie.remove(runtimeConfig.public.auth.refreshTokenKey); // Remove fresh token cookie
      cookie.remove(runtimeConfig.public.auth.rememberKey); // Remove remember cookie

      // Notify apollo
      const { onLogout } = useApollo();
      await onLogout();

      // Notify other windows
      if (broadcast) window.localStorage.setItem('logout', '1');
    },
    async requestPasswordReset(email: string) {
      const { mutate } = useRequestPasswordResetMutationMutation({
        variables: {
          email
        }
      });

      const { data } = await mutate();

      if (!data.sendPasswordResetEmail.success) {
        throw new ValidationError(
          Errors.createFromAPI(data.sendPasswordResetEmail.errors)
        );
      }
    },
    async resetPassword(
      resetToken: string,
      password: string,
      confirmedPassword: string
    ) {
      const { mutate } = useResetPasswordMutationMutation({
        variables: {
          token: resetToken,
          password,
          confirmedPassword
        }
      });

      const { data } = await mutate();

      if (!data.passwordReset.success) {
        throw new ValidationError(
          Errors.createFromAPI(data.passwordReset.errors)
        );
      }
    },
    async activateAccount(activationToken: string) {
      const { mutate } = useActiveAccountMutationMutation({
        variables: {
          token: activationToken
        }
      });

      const { data } = await mutate();

      if (!data.verifyAccount.success) {
        throw new ValidationError(
          Errors.createFromAPI(data.verifyAccount.errors)
        );
      }
    },
    async register(
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      confirmedPassword: string
    ) {
      const { mutate } = useRegisterUserMutationMutation({
        variables: {
          firstName,
          lastName,
          email,
          password,
          confirmedPassword
        }
      });

      const { data } = await mutate();

      if (!data.register.success) {
        throw new ValidationError(Errors.createFromAPI(data.register.errors));
      }
    },
    isRemembering() {
      const runtimeConfig = useRuntimeConfig();
      return !!cookie.get(runtimeConfig.public.auth.rememberKey);
    },
    getRefreshToken() {
      const runtimeConfig = useRuntimeConfig();
      return cookie.get(runtimeConfig.public.auth.refreshTokenKey);
    },
    hasPermission(permission) {
      return this.user.permissions.includes(permission);
    }
  }
});
