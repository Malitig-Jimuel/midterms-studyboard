type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

// TODO (Step 6): Implement the fixed-window algorithm.
// 1. Get the current time: const now = Date.now();
// 2. Look up the entry for this key: const entry = store.get(key);
// 3. If there's no entry, OR the window has expired (now > entry.resetAt):
//      - Start a fresh window: store.set(key, { count: 1, resetAt: now + windowMs })
//      - Return { success: true, remaining: limit - 1 }
// 4. Otherwise, if entry.count >= limit:
//      - Return { success: false, remaining: 0 }
// 5. Otherwise (still within the window, under the limit):
//      - Increment entry.count
//      - Return { success: true, remaining: limit - entry.count }
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });  
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count+= 1;
  //entry.count = entry.count + 1;
  return { success: true, remaining: limit - entry.count };
}