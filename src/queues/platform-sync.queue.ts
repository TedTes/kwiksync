import Queue from "bull";
import { PlatformSyncProcessor } from "../services";

interface PlatformSyncJob {
  jobId: string;
  merchantId: number;
  itemId: string;
  platform: string;
  sku: string;
  productId: string;
  newStock: number;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

class PlatformSyncQueue {
  private queue: Queue.Queue<PlatformSyncJob>;
  private processor: PlatformSyncProcessor;

  constructor() {
    // Initialize Bull queue with Redis connection
    this.queue = new Queue<PlatformSyncJob>("platform-sync", {
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD,
      },
    });

    this.processor = new PlatformSyncProcessor();

    // Set up queue processing
    this.queue.process("syncInventory", async (job) => {
      return await this.processor.process(job);
    });

    // Set up event handlers
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.queue.on("completed", async (job) => {
      console.log(`Job ${job.data.jobId} completed successfully`);
      // TODO :  update database or emit events ???????
    });

    this.queue.on("failed", async (job, error) => {
      console.error(`Job ${job?.data.jobId} failed:`, error);

      // TODO :  Handle failure, maybe notify admin or update status in database ???????
    });

    this.queue.on("error", (error) => {
      console.error("Queue error:", error);
      // TODO :  Handle queue-level errors
    });
  }

  async add(
    jobName: string,
    data: PlatformSyncJob,
    options?: Queue.JobOptions
  ): Promise<Queue.Job<PlatformSyncJob>> {
    return await this.queue.add(jobName, data, options);
  }

  async getJob(jobId: string): Promise<Queue.Job<PlatformSyncJob> | null> {
    return await this.queue.getJob(jobId);
  }

  async getJobStatus(jobId: string): Promise<string | null> {
    const job = await this.getJob(jobId);
    if (!job) return null;
    return await job.getState();
  }
}

// Export a singleton instance
export const platformSyncQueue = new PlatformSyncQueue();
