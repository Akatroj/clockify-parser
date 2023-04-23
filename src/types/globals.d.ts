interface Date {
  toTemporalInstant: (this: Date) => Temporal.Instant;
}

namespace NodeJS {
  interface ProcessEnv {
    CLOCKIFY_API_KEY: string;
  }
}
