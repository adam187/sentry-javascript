import { EventType } from '@sentry-internal/rrweb';
import type { FeedbackEvent } from '@sentry/types';

import type { ReplayContainer } from '../../types';

/**
 * Add a feedback breadcrumb event to replay.
 */
export function addFeedbackBreadcrumb(replay: ReplayContainer, event: FeedbackEvent): void {
  replay.triggerUserActivity();
  replay.addUpdate(() => {
    if (!event.timestamp) {
      // Ignore events that don't have timestamps (this shouldn't happen, more of a typing issue)
      // Return true here so that we don't flush
      return true;
    }

    void replay.throttledAddEvent({
      type: EventType.Custom,
      timestamp: event.timestamp * 1000,
      data: {
        timestamp: event.timestamp,
        tag: 'breadcrumb',
        payload: {
          category: 'sentry.feedback',
          data: {
            feedbackId: event.event_id,
          },
        },
      },
    });

    return false;
  });
}
