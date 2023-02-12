export default function () {
  const scannedValue = ref<string | undefined>();

  let code = '';
  let reading = false;

  function onKeyPress(e: KeyboardEvent) {
    //usually scanners throw an 'Enter' key at the end of read
    if (e.code === 'Enter') {
      if (code.length > 10) {
        scannedValue.value = code;
      }
    } else {
      code += e.key; //while this is not an 'enter' it stores the every key
    }

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
