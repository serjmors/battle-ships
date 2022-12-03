export const safeJsonParse = <T>(guard: (o: any) => o is T) => 
  (text: string): ParseResult<T> => {
    const parsed = JSON.parse(text)
    return guard(parsed) ? { parsed, hasError: false } : { hasError: true }
  }

export type ParseResult<T> =
  | { parsed: T; hasError: false; error?: undefined }
  | { parsed?: undefined; hasError: true; error?: unknown }