import { DateTime } from 'luxon'
import ValidationError from '@/errors/ValidationError'
import Swal from 'sweetalert2'
import resolveConfig from 'tailwindcss/resolveConfig'
import humanizeDuration from 'humanize-duration'

import Errors from '@/classes/Errors'

/**
 * Joins a list together with commas, but uses "and" for the final pair
 * e.g. The Winston Theatre, The Pegg Theatre and The Anson Rooms
 *
 * @param {Array<string>} array List of strings to join
 * @returns {string} Joined string
 */
const joinWithAnd = (array) => {
  return array.join(', ').replace(/, ([^,]*)$/, ' and $1')
}

/**
 * Calculates the duration, in ms, between two date times
 *
 * @param {string} start ISO format start datetime
 * @param {string} end ISO format end datetime
 * @returns {any} Difference between start and end in milliseconds
 */
const duration = (start, end) => {
  start = DateTime.fromISO(start)
  end = DateTime.fromISO(end)
  return end.diff(start)
}

/**
 * Generates a start to end date string given a start and end date
 *
 * @param {string} start ISO format start datetime
 * @param {string} end ISO format end datetime
 * @param {string} format Luxon datetime format string (excluding year)
 * @returns {string} Formatted start to end datetime string
 */
const displayStartEnd = (start, end, format) => {
  start = DateTime.fromISO(start)
  end = DateTime.fromISO(end)

  let result = ''
  if (start.month !== end.month || start.day !== end.day) {
    result =
      start.toFormat(start.year === end.year ? format : format + ' y') + ' - '
  }

  result += `${end.toFormat(format + ' y')}`
  return result
}

/**
 * Generates a readable string for a given duration in minuites
 *
 * @param {number} durationMins number of minuites
 * @returns {string} Formatted readable duration string
 */
const humanDuration = (durationMins) => {
  return humanizeDuration(durationMins * 60 * 1000)
}

/**
 * Merged Tailwind Config Object
 */
const tailwindConfig = resolveConfig(require('./tailwind.config'))

const errorHandler = (e) => {
  // TODO: Implement sentry here (and probably also in the apollo error handler)
  // eslint-disable-next-line no-console
  console.error(e)
  apiErrorToast.fire()
}

/**
 * Catches only the given error(s). Otherwise, throws.
 *
 * @param {Array|Class} errors List or single error class
 * @param {Error} caughtError The caught error
 * @param {Function} callback The function to call if is a valid exception
 */
const catchOnly = (errors, caughtError, callback) => {
  if (!Array.isArray(errors)) errors = [errors]

  if (errors.some((errorClass) => caughtError instanceof errorClass)) {
    return callback(caughtError)
  }

  throw caughtError
}

const getValidationErrors = (error, throwExp = true) => {
  if (!(error instanceof ValidationError)) {
    if (!throwExp) return
    throw error
  }
  return error.errors
}

const performMutation = (apollo, options, mutationName) => {
  return new Promise((resolve, reject) => {
    apollo
      .mutate(options)
      .then(({ data }) => {
        if (!data[mutationName].success)
          return reject(
            new ValidationError(Errors.createFromAPI(data[mutationName].errors))
          )
        resolve(data)
      })
      .catch((e) => {
        errorHandler(e)
        reject(e)
      })
  })
}

/**
 * Default branded Sweetalert instances
 */

const swal = Swal.mixin({
  background: tailwindConfig.theme.colors['sta-gray'].DEFAULT,
  customClass: {
    title: 'text-white',
    content: 'text-white',
    htmlContainer: 'text-white',
  },
  confirmButtonColor: tailwindConfig.theme.colors['sta-orange'].DEFAULT,
  denyButtonColor: tailwindConfig.theme.colors['sta-rouge'].DEFAULT,
})
const swalToast = swal.mixin({
  toast: true,
  showConfirmButton: false,
  position: 'bottom-end',
})
const errorToast = swalToast.mixin({
  icon: 'error',
})
const successToast = swalToast.mixin({
  icon: 'success',
})
const apiErrorToast = errorToast.mixin({
  icon: 'error',
  title: 'There was a server error while executing your request',
  timerProgressBar: true,
  timer: 4000,
})

export {
  apiErrorToast,
  errorToast,
  successToast,
  displayStartEnd,
  humanDuration,
  duration,
  errorHandler,
  joinWithAnd,
  performMutation,
  swal,
  swalToast,
  tailwindConfig,
  catchOnly,
  getValidationErrors,
}
