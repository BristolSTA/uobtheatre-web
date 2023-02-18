export default function () {
  const scannedValue = ref<string | undefined>();

  let code = '';
  let reading = false;
  let previousKeyShift = false;

  function onKeyPress(e: KeyboardEvent) {
    if (e.key == 'Shift') {
      previousKeyShift = true;
      return;
    }

    //usually scanners throw an 'Enter' key at the end of read
    if (e.code === 'Enter') {
      if (code.length > 10) {
        if (code === scannedValue.value) {
          scannedValue.value = undefined;
          setTimeout(() => (scannedValue.value = code), 0.5);
          return;
        }
        scannedValue.value = code;
      }
    } else {
      code += previousKeyShift ? e.key.toUpperCase() : e.key; //while this is not an 'enter' it stores the every key
    }

    previousKeyShift = false;

    //run a timeout of 200ms at the first read and clear everything
    if (!reading) {
      reading = true;
      setTimeout(() => {
        code = '';
        reading = false;
      }, 200);
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
