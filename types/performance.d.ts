import type { FullPerformanceAndTicketOptionsQuery } from '~~/graphql/codegen/operations.generated';

export type TicketOptions = NonNullable<
  NonNullable<
    FullPerformanceAndTicketOptionsQuery['performance']
  >['ticketOptions']
>;
