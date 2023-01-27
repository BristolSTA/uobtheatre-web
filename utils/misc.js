import * as Sentry from '@sentry/browser';

export const errorHandler = (e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  apiErrorToast.fire();
  Sentry.captureException(e);
};

export const silentErrorHandler = (e, context) => {
  // eslint-disable-next-line no-console
  console.error(e);
  Sentry.captureException(e, context);
};

export const isInViewport = function (elem) {
  const bounding = elem.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
};
