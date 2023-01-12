// FYI, VRM = Visitor Relationship Management
import { event, purchase } from 'vue-gtag';

interface EventDescription {
  category: string;
  action: string;
  label?: string;
}

export const events = {
  booking: {
    started: { category: 'booking', action: 'started' },
    resumed: { category: 'booking', action: 'resumed' },
    completed: { category: 'booking', action: 'completed' },
    abandoned: { category: 'booking', action: 'abandoned' },
    expried: { category: 'booking', action: 'expired' }
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
  purchaseDetails: Parameters<typeof purchase>[0]
): void {
  purchase(purchaseDetails);
}
