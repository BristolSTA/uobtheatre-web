export default function useHardwareScanner(
  maxInputDelay = 200,
  checkIsEncoded = false
) {
  const scannedValue = ref<string | undefined>();

  let code = '';
  let reading = false;
  let previousKeyShift = false;

  function onKeyPress(e: KeyboardEvent) {
    // Some of the scanners truely replicate a keyboard by pressing / holding shift before typing an uppercase letter
    // We track these shift events, to later on be able to turn keys into uppercase if the preceeding key has been a shift
    if (e.key == 'Shift') {
      previousKeyShift = true;
      return;
    }

    //usually scanners throw an 'Enter' key at the end of read
    console.log(code, e.key);
    if (e.code === 'Enter') {
      if (code.length > 10) {
        if (checkIsEncoded) {
          try {
            atob(code);
          } catch (e) {
            return;
          }
        }

        if (code === scannedValue.value) {
          // If the newly scanned code is equal to the previous scanned value, it will briefly be set to undefined to allow watchers to trigger
          scannedValue.value = undefined;
          setTimeout(() => (scannedValue.value = code), 0.5);
          return;
        }
        // Otherwise, we just update the scanned value
        scannedValue.value = code;
      }
    } else {
      // Add the key to the code string
      code += previousKeyShift ? e.key.toUpperCase() : e.key; //while this is not an 'enter' it stores the every key
    }

    previousKeyShift = false;

    //run a timeout of 200ms at the first read and clear everything
    if (!reading) {
      reading = true;
      setTimeout(() => {
        code = '';
        reading = false;
      }, maxInputDelay);
    }
  }

  onMounted(() => {
    document.addEventListener('keyup', onKeyPress);
  });

  onUnmounted(() => {
    document.removeEventListener('keyup', onKeyPress);
  });

  return scannedValue;
}
