import * as Sentry from '@sentry/browser';
import axios from "axios";

export const errorHandler = (e) => {
   
  silentErrorHandler(e);
  apiErrorToast.fire();
};

export const silentErrorHandler = (e, context = {}) => {
   
  if (axios.isAxiosError(e)) {
    context = { extra: e.toJSON(), ...context };
  }
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

