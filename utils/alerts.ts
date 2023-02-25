import Swal from 'sweetalert2';
import tailwindConfig from '#tailwind-config';

export const swal = Swal.mixin({
  // @ts-ignore
  background: tailwindConfig.theme.colors['sta-gray'].DEFAULT,
  customClass: {
    title: 'text-white',
    htmlContainer: 'text-white',
    input: 'bg-white'
  },
  // @ts-ignore
  confirmButtonColor: tailwindConfig.theme.colors['sta-orange'].DEFAULT,
  // @ts-ignore
  denyButtonColor: tailwindConfig.theme.colors['sta-rouge'].DEFAULT
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
