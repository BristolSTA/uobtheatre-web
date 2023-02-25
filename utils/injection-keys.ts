import type { InjectionKey } from 'vue';
import { BoxOfficePerformanceQuery } from '~~/graphql/codegen/operations';

export default {
  boxOffice: {
    performance: Symbol() as InjectionKey<
      NonNullable<BoxOfficePerformanceQuery['performance']>
    >
  }
};
