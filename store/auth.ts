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
  useRegisterUserMutationMutation,
  useResendActivationMutationMutation
} from '@/graphql/codegen/operations';
import Errors from '~~/classes/Errors';
import ValidationError from '~~/errors/ValidationError';
import UnverifiedLoginError from '~~/errors/auth/UnverifiedLoginError';

let refreshTimer: NodeJS.Timeout | null;

export const foo = 'bar';

export default defineStore('auth', {
  state: () => ({
    user: null as AuthUserDetailsFragment | null
  }),
  getters: {
    isLoggedIn: (state) => !!state.user
  },
  actions: {
    /**
     * Sets the auth user's details in the state
     * @param userDetails Object of user's details
     */
    setAuthUser(userDetails: AuthUserDetailsFragment) {
      this.user = userDetails;
    },

    async getToken(): Promise<string | undefined> {
      const { getToken } = useApollo();
      return (await getToken()) as string | undefined;
    },

    /**
     * Load user's details from the API
     */
    async loadUserDetails() {
      // Fetch from API without cache
      const { data } = await useAsyncQuery<LoadUserDetailsQuery>(
        LoadUserDetailsDocument,
        {
          fetchPolicy: 'no-cache'
        }
      );

      // If the user isn't returned, log out
      if (!data.value?.me) {
        return this.logout();
      }

      // Otherwise set the user in state
      this.user = data.value.me;
    },

    /**
     * Attempt to login the user with the provided details
     *
     * @param email The user's email
     * @param password The user's password
     * @param remember Whether the user would like to be remembered on this device
     */
    async login(email: string, password: string, remember: boolean) {
      const loginData = await doMutation(
        useLoginMutationMutation({
          variables: { email, password }
        }),
        'login'
      );

      // Check the user is verified
      if (!loginData.user?.verified) {
        throw new UnverifiedLoginError();
      }

      // Check we have the tokens we need
      if (!loginData.token || !loginData.refreshToken)
        throw new ValidationError(
          Errors.createFromMessage(
            'Invalid response recieved. Please try again'
          )
        );

      // Store the auth token & tell Apollo about our shiny new token
      await this.setToken(loginData.token);
      // Store the fresh token
      await this.setRefreshToken(loginData.refreshToken, remember);
      // Start queing a token refresh
      await this.queueRefresh();
      // Load user details
      await this.loadUserDetails();
    },

    async setToken(newToken: string) {
      const { onLogin } = useApollo();
      return onLogin(newToken);
    },

    /**
     * Refresh the user auth tokens and data using the exisiting token
     */
    async refreshUsingToken() {
      let currentRefreshToken;
      // If the user doesn't have a refresh token, we'll log them out
      if (!(currentRefreshToken = this.getRefreshToken())) {
        return this.logout();
      }

      // Use the refresh token to get a new token and refresh token
      const { mutate } = useRefreshTokenMutationMutation({
        variables: {
          refreshToken: currentRefreshToken
        }
      });

      const mutateResponse = await mutate();

      const authToken = mutateResponse?.data?.refreshToken?.token;
      const refreshToken = mutateResponse?.data?.refreshToken?.refreshToken;

      if (!authToken || !refreshToken) {
        return this.logout();
      }

      // Store the new tokens
      await this.setToken(authToken);
      this.setRefreshToken(refreshToken);
      this.queueRefresh();

      // Load the user's details
      return this.loadUserDetails();
    },

    /**
     * Queue a refresh of the auth token
     */
    async queueRefresh() {
      // If the timer is defined, we'll make sure it is cleared
      if (refreshTimer) clearTimeout(refreshTimer);

      let nextSheduledRefreshSeconds = 1;

      const token = await this.getToken();
      if (token) {
        const { exp } = jwtDecode<JwtPayload>(token);
        // If the JWT contains an expiry, we'll refresh 30 seconds before (or in 1 second if refresh already due). If it doesn't, we'll refresh in 1 minute
        nextSheduledRefreshSeconds = Math.max(
          1,
          exp ? exp - Math.round(Date.now() / 1000) - 30 : 60
        );
      }

      // Schedule a refresh of the token
      refreshTimer = setTimeout(() => {
        refreshTimer = null;
        this.refreshUsingToken();
      }, nextSheduledRefreshSeconds * 1000);
    },

    /**
     * Stores the given refresh token, taking into account device-user remembering preference
     *
     * @param refreshToken The refresh token
     * @param remember Whether the user should be remembered on this device
     */
    setRefreshToken(
      refreshToken: string,
      remember: boolean | undefined = undefined
    ) {
      const runtimeConfig = useRuntimeConfig();
      const rememberLengthDays = 365;

      // If the user wants to be remembered, we'll store a cookie to remember this preference
      if (remember) {
        cookie.set(runtimeConfig.public.auth.rememberKey, 'true', {
          expires: remember ? rememberLengthDays : undefined
        });
      } else if (
        remember === false &&
        cookie.get(runtimeConfig.public.auth.rememberKey)
      ) {
        // If they don't want to be remembered, and the remember cookie is set, we'll take this opertunitiy to remove it
        cookie.remove(runtimeConfig.public.auth.rememberKey);
      }

      // Finally, we'll set a cookie with the refresh token. If the user wants to be remembered, we'll make this expire in 1 year, otherwise it will expire with the session
      cookie.set(runtimeConfig.public.auth.refreshTokenKey, refreshToken, {
        expires: this.isRemembering() ? rememberLengthDays : undefined
      });
    },

    /**
     * Logout the user
     *
     * @param broadcast bool If true, we'll broadcast the logout to other windows on this PC (so if they log out in one tab, it will log them out in all tabs on that PC.)
     */
    async logout(broadcast = true) {
      const runtimeConfig = useRuntimeConfig();

      // Wipe store
      this.user = null;

      // Clear refresh timeout
      if (refreshTimer) clearTimeout(refreshTimer);

      // Remove cookies
      cookie.remove(runtimeConfig.public.auth.refreshTokenKey); // Remove fresh token cookie
      cookie.remove(runtimeConfig.public.auth.rememberKey); // Remove remember cookie

      navigateTo('/');

      // Notify apollo
      const { onLogout } = useApollo();
      await onLogout();

      // Notify other windows
      if (broadcast) window.localStorage.setItem('logout', '1');
    },

    /**
     * Request a password reset for an given email address
     *
     * @param email string Email address to request a reset for
     */
    async requestPasswordReset(email: string) {
      // Send the mutation to request the reset
      const { mutate } = useRequestPasswordResetMutationMutation({
        variables: {
          email
        }
      });

      const mutateResponse = await mutate();
      const data = mutateResponse?.data?.sendPasswordResetEmail;

      // Check we got the data we asked for
      if (!mutateResponse || !data) {
        throw new ValidationError(
          Errors.createFromMessage('An unknown error occured')
        );
      }

      // If the mutation was not successful, throw the errors
      if (!data.success)
        throw new ValidationError(Errors.createFromAPI(data.errors));
    },

    /**
     * Reset an account password using a token
     *
     * @param resetToken The reset token
     * @param password The desired, new password
     * @param confirmedPassword Confirmation of the new password
     */
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

      const mutateResponse = await mutate();
      const data = mutateResponse?.data?.passwordReset;

      // Check we got the data we wanted
      if (!data)
        throw new ValidationError(
          Errors.createFromMessage('An unknown error occured')
        );

      // If the mutation wasn't successful, we'll throw the errors
      if (!data.success) {
        throw new ValidationError(Errors.createFromAPI(data.errors));
      }
    },

    /**
     * Activate an account using a token
     *
     * @param activationToken The activation token
     */
    async activateAccount(activationToken: string) {
      const { mutate } = useActiveAccountMutationMutation({
        variables: {
          token: activationToken
        }
      });

      const mutateResponse = await mutate();
      const data = mutateResponse?.data?.verifyAccount;
      // Check we got the data we wanted
      if (!data)
        throw new ValidationError(
          Errors.createFromMessage('An unknown error occured')
        );

      // If the mutation wasn't successful, we'll throw the errors
      if (!data.success) {
        throw new ValidationError(Errors.createFromAPI(data.errors));
      }
    },

    /**
     * Register a new account
     *
     * @param firstName The user's first name, correctly capitalised
     * @param lastName The user's last name, correctly capitalised
     * @param email The user's email address
     * @param password The user's desired password
     * @param confirmedPassword The confirmation of the user's password
     */
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

      const mutateResponse = await mutate();
      const data = mutateResponse?.data?.register;

      // Check we got the data we wanted
      if (!data)
        throw new ValidationError(
          Errors.createFromMessage('An unknown error occured')
        );

      // If the mutation wasn't successful, we'll throw the errors
      if (!data.success) {
        throw new ValidationError(Errors.createFromAPI(data.errors));
      }
    },

    /**
     * Resends the account verification email for an account
     *
     * @param email The user's email address
     */
    async resendVerificationEmail(email: string) {
      await doMutation(
        useResendActivationMutationMutation({
          variables: {
            email
          }
        }),
        'resendActivationEmail'
      );
    },

    /**
     * Returns whether the user has requested to be remembered
     */
    isRemembering() {
      const runtimeConfig = useRuntimeConfig();
      return !!cookie.get(runtimeConfig.public.auth.rememberKey);
    },

    /**
     * Returns the refresh token, if given
     */
    getRefreshToken(): string | undefined {
      const runtimeConfig = useRuntimeConfig();
      return cookie.get(runtimeConfig.public.auth.refreshTokenKey);
    },

    /**
     * Returns if the current user has the specified permission
     *
     * @param permission The permission
     */
    hasPermission(permission: string) {
      if (!this.user || !this.user.permissions) return false;
      return this.user.permissions.includes(permission);
    }
  }
});
