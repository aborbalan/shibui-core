export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta: { timestamp: string; path: string };
}
