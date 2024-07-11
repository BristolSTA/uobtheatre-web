import type { InjectionKey } from 'vue';
import type { BoxOfficePerformanceQuery } from '~~/graphql/codegen/operations';

export default {
  boxOffice: {
    performance: Symbol() as InjectionKey<
      NonNullable<BoxOfficePerformanceQuery['performance']>
    >
  }
};
