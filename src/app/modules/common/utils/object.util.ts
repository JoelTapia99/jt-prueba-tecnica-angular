export function trimObjectValues<T extends Record<string, unknown>>(obj: T): T {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return obj;

  const trimmedObj: Record<string, unknown> = { ...obj };

  for (const key in trimmedObj) {
    if (Object.prototype.hasOwnProperty.call(trimmedObj, key)) {
      const value = trimmedObj[key];

      if (typeof value === 'string') trimmedObj[key] = value.trim();
    }
  }
  return trimmedObj as T;
}
