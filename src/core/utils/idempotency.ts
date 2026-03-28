export const createIdempotencyKey = (): string =>
    `tf-${crypto.randomUUID()}-${Date.now()}`;
