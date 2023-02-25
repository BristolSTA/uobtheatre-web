import type { FullPerformanceAndTicketOptionsQuery } from '~~/graphql/codegen/operations';

export type TicketOptions = NonNullable<
  NonNullable<
    FullPerformanceAndTicketOptionsQuery['performance']
  >['ticketOptions']
>;
