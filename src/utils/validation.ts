export function ensureNotNull<T>(value: T, paramName: string): T {
  if (value == null) {
    throw new Error(`${paramName} cannot be null or undefined.`);
  }
  return value;
}

export function ensureNotNullOrEmpty(
  value: string | null | undefined,
  paramName: string
): string {
  if (value == null || value.trim().length === 0) {
    throw new Error(`${paramName} cannot be null or empty.`);
  }
  return value;
}

export function ensurePositiveInteger(
  value: number | null | undefined,
  paramName: string
): number {
  if (!Number.isInteger(value) || value == null || value <= 0) {
    throw new Error(`${paramName} must be a positive integer.`);
  }
  return value;
}

export function ensureFutureDate(
  date: Date,
  secondsInFuture: number,
  paramName: string
): Date;
export function ensureFutureDate(
  date: Date | null | undefined,
  paramName: string
): Date;
export function ensureFutureDate(
  date: Date | null | undefined,
  secondsInFutureOrParamName: number | string,
  paramName?: string
): Date {
  if (date == null) {
    throw new Error(
      `${
        typeof secondsInFutureOrParamName === "string"
          ? secondsInFutureOrParamName
          : paramName
      } cannot be null or undefined.`
    );
  }

  const now = new Date();
  let futureThreshold = now;

  if (typeof secondsInFutureOrParamName === "number") {
    futureThreshold = new Date(
      now.getTime() + secondsInFutureOrParamName * 1000
    );
    if (date < futureThreshold) {
      throw new Error(
        `${paramName} must be at least ${secondsInFutureOrParamName} seconds in the future.`
      );
    }
  } else if (date <= now) {
    throw new Error(`${secondsInFutureOrParamName} must be a future date.`);
  }

  return date;
}

export function ensurePastDate(date: Date, paramName: string): Date {
  if (date > new Date()) {
    throw new Error(`${paramName} must be a past date.`);
  }
  return date;
}

export function ensureEmail(email: string): string {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    throw new Error("Invalid email format.");
  }
  return email;
}
