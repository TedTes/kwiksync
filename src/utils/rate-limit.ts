import { AppDataSource } from "../config";
export const rateLimit = {
  async check(key: string): Promise<boolean> {
    try {
      const maxAttempts = 3;
      const windowMs = 15 * 60 * 1000; // 15 minutes

      //   const attempts = await AppDataSource.rateLimits.findFirst({
      //     where: {
      //       key,
      //       timestamp: {
      //         gt: new Date(Date.now() - windowMs),
      //       },
      //     },
      //   });

      //   if (!attempts) return false;
      //   return attempts.count >= maxAttempts;
      return false;
    } catch (error) {
      console.error("Rate limit check error:", error);
      return false;
    }
  },

  async increment(key: string): Promise<void> {
    try {
      //   await AppDataSource.rateLimits.upsert({
      //     where: { key },
      //     update: {
      //       count: { increment: 1 },
      //       timestamp: new Date(),
      //     },
      //     create: {
      //       key,
      //       count: 1,
      //       timestamp: new Date(),
      //     },
      //   });
    } catch (error) {
      console.error("Rate limit increment error:", error);
    }
  },
};
