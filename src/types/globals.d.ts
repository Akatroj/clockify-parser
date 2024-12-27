import type { Temporal } from '@js-temporal/polyfill';
import type { ApiConfig } from './api';

type Env = Partial<ApiConfig> & {
  // additional keys
};

declare global {
  interface Date {
    toTemporalInstant: (this: Date) => Temporal.Instant;
  }

  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
