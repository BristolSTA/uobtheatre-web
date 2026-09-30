import type { InjectionKey } from 'vue';
import type { BoxOfficePerformanceQuery } from '~~/graphql/codegen/operations.generated';

export default {
  boxOffice: {
    performance: Symbol() as InjectionKey<
      NonNullable<BoxOfficePerformanceQuery['performance']>
    >
  }
};
