import { event, ecommerce } from 'vue-gtag';

interface EventDescription {
  category: string;
  action: string;
  label?: string;
}

export const events = {
  booking: {
    started: { category: 'ecommerce', action: 'booking_started' },
    resumed: { category: 'ecommerce', action: 'booking_resumed' },
    completed: { category: 'ecommerce', action: 'booking_completed' },
    abandoned: { category: 'ecommerce', action: 'booking_abandoned' },
    expried: { category: 'ecommerce', action: 'booking_expired' }
  }
};

export function recordEvent(eventDescription: EventDescription): void {
  event(eventDescription.action, {
    event_category: eventDescription.category,
    event_label: eventDescription.label,
    method: 'Google'
  });
}

export function recordPaymentEvent(
  purchaseDetails: Parameters<typeof ecommerce>[1]
): void {
  ecommerce('purchase', purchaseDetails);
}
