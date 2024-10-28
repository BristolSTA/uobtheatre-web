import type { TicketQRCodeData } from '~~/types/ticket';
import Ticket from '~~/classes/Ticket';
import InvalidTicketQRCodeException from '~~/exceptions/InvalidTicketQRCodeException';

export default function useHardwareTicketScanner() {
  const scannedValue = useHardwareScanner();
  const ticketDetails = ref<TicketQRCodeData | undefined>();
  const isInvalid = ref<boolean>(false);

  watch(scannedValue, (value) => {
    isInvalid.value = false;
    if (!value) return (ticketDetails.value = undefined);

    try {
      ticketDetails.value = Ticket.dataFromQRCode(value);
    } catch (e) {
      if (e instanceof InvalidTicketQRCodeException) {
        return (isInvalid.value = true);
      }
      throw e;
    }
  });

  return { ticketDetails, isInvalid };
}
