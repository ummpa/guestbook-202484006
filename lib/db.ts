// The only thing the domain modules need from a database: run one
// parameterised statement and get its rows back. Neon in the app,
// PGlite in tests.
export type Db = {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
};

export type Clock = { now: () => Date };

export const systemClock: Clock = { now: () => new Date() };

// Neon and PGlite may hand timestamps back as Date or as string.
export function toDate(value: Date | string): Date {
  return new Date(value);
}

export function toDateOrNull(value: Date | string | null): Date | null {
  return value === null ? null : new Date(value);
}
