import Swal from 'sweetalert2';
import tailwindConfig from '#tailwind-config';
import resolveConfig from 'tailwindcss/resolveConfig';

// @ts-expect-error - Throws an assignment error, but this is recco'd by the docs (https://tailwindcss.com/docs/configuration#referencing-in-java-script)
const fullConfig = resolveConfig(tailwindConfig);

export const swal = Swal.mixin({
  // @ts-ignore
  background: fullConfig.theme.colors['sta-gray'].DEFAULT,
  customClass: {
    title: 'text-white',
    htmlContainer: 'text-white',
    input: 'bg-white'
  },
  // @ts-ignore
  confirmButtonColor: fullConfig.theme.colors['sta-orange'].DEFAULT,
  // @ts-ignore
  denyButtonColor: fullConfig.theme.colors['sta-rouge'].DEFAULT
});
export const swalToast = swal.mixin({
  toast: true,
  showConfirmButton: false,
  position: 'bottom-end'
});
export const errorToast = swalToast.mixin({
  icon: 'error'
});
export const successToast = swalToast.mixin({
  icon: 'success',
  timer: 8000,
  timerProgressBar: true
});
export const apiErrorToast = errorToast.mixin({
  icon: 'error',
  title: 'There was a server error while executing your request',
  timerProgressBar: true,
  timer: 4000
});
export const loadingSwal = swal.mixin({
  didOpen: () => {
    Swal.showLoading(undefined);
  },
  allowOutsideClick: false,
  allowEscapeKey: false
});
