import Swal from 'sweetalert2';

// Create a custom-themed Swal instance for the Catalyst Zinc Palette
const CatalystSwal = Swal.mixin({
  customClass: {
    popup: 'swal-premium-popup',
    title: 'swal-premium-title',
    htmlContainer: 'swal-premium-content',
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-outline',
    timerProgressBar: 'swal-premium-progress',
  },
  buttonsStyling: false,
  background: 'var(--bg-card)',
  color: 'var(--text-main)',
  showClass: {
    popup: `
      animate__animated
      animate__fadeInDown
      animate__faster
    `
  },
  hideClass: {
    popup: `
      animate__animated
      animate__fadeOutUp
      animate__faster
    `
  }
});

/**
 * Premium Toast Notification
 * @param {string} title - Message title
 * @param {string} icon - 'success' | 'error' | 'warning' | 'info'
 */
export const toast = (title, icon = 'success') => {
  CatalystSwal.fire({
    title,
    icon,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
};

/**
 * Premium Confirmation Dialog
 * @param {string} title
 * @param {string} text
 * @param {string} icon
 * @returns {Promise<boolean>}
 */
export const confirm = async (title, text, icon = 'warning') => {
  const result = await CatalystSwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  });
  return result.isConfirmed;
};

/**
 * Premium Alert Dialog (Standard)
 * @param {string} title
 * @param {string} text
 * @param {string} icon
 */
export const alert = (title, text, icon = 'info') => {
  CatalystSwal.fire({
    title,
    text,
    icon,
    confirmButtonText: 'Dismiss'
  });
};

export default CatalystSwal;
