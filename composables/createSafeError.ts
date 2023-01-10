export const createSafeError = (
  errorDetails: Parameters<typeof createError>[0]
) => {
  showError(errorDetails);

  const router = useRouter();
  router.afterEach(() => {
    clearError();
  });

  return createError(errorDetails);
};
