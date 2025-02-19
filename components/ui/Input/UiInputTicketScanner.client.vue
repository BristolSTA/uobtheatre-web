<template>
  <qrcode-stream
    :camera="!on || cameraReset ? 'off' : 'auto'"
    :track="onTrackEvent"
    @camera-on="cameraOn"
    @detect="onDetect"
  >
    <slot />
  </qrcode-stream>
</template>

<script lang="ts" setup>
import { QrcodeStream } from 'vue-qrcode-reader';
import Ticket from '~~/classes/Ticket';
import InvalidTicketQRCodeException from '~~/exceptions/InvalidTicketQRCodeException';
import type { TicketQRCodeData } from '~~/types/ticket';

const props = withDefaults(
  defineProps<{ on?: boolean; pauseOnDecode?: boolean }>(),
  { on: true, pauseOnDecode: true }
);

const cameraReset = ref(false);

const emit = defineEmits<{
  (event: 'ready'): void;
  (event: 'unable', message: string): void;
  (
    event: 'scanned',
    data: { ticketData: TicketQRCodeData; reenable: () => void }
  ): void;
  (event: 'invalidCode'): void;
}>();

function onTrackEvent(detectedCodes: any, ctx: any) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y);
    }
    ctx.lineTo(firstPoint.x, firstPoint.y);
    ctx.closePath();
    ctx.stroke();
  }
}

async function cameraOn(c: MediaTrackCapabilities) {
  try {
    emit('ready');
  } catch (error: any) {
    let errorMessage;

    if (error?.name === 'NotAllowedError') {
      // user denied camera access permisson
      errorMessage = 'Camera access denied due to user permissions';
    } else if (error?.name === 'NotFoundError') {
      // no suitable camera device installed
      errorMessage = 'No camera available on device';
    } else if (
      error?.name === 'NotSupportedError' ||
      error?.name === 'InsecureContextError'
    ) {
      // page is not served over HTTPS (or localhost)
      errorMessage = 'Camera access denied for security';
    } else if (error?.name === 'NotReadableError') {
      // maybe camera is already in use
      errorMessage = 'Camera is already in use';
    } else if (error?.name === 'OverconstrainedError') {
      // did you requested the front camera although there is none?
      errorMessage = 'Unable to find supported camera';
    } else if (error?.name === 'StreamApiNotSupportedError') {
      // browser seems to be lacking features
      errorMessage = 'Browser unsupported';
    } else {
      throw error;
    }
    emit('unable', errorMessage);
  }
}
function onDetect(detectedCodes: { rawValue: string }[]) {
  new Audio('/audio/beep_single.mp3').play();

  try {
    const rawValue = `${JSON.stringify(detectedCodes.map((code) => code.rawValue))} ${new Date().getTime()}`;
    const ticketData = Ticket.dataFromQRCode(rawValue);
    if (props.pauseOnDecode) {
      cameraReset.value = true;
    }
    emit('scanned', {
      ticketData,
      reenable: () => {
        cameraReset.value = false;
      }
    });
  } catch (e) {
    if (e instanceof InvalidTicketQRCodeException) return emit('invalidCode');
    throw e;
  }
}
</script>
