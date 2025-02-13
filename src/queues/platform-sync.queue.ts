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
  private static instance: PlatformSyncQueue;
  private queue: Queue.Queue<PlatformSyncJob>;
  private processor: PlatformSyncProcessor;
  private initializationPromise: Promise<void> | null = null;
  private isInitialized: boolean = false;
  private constructor() {
    this.processor = new PlatformSyncProcessor();
  }

  public static getInstance(): PlatformSyncQueue {
    if (!PlatformSyncQueue.instance) {
      PlatformSyncQueue.instance = new PlatformSyncQueue();
    }
    return PlatformSyncQueue.instance;
  }

  private initialize(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }

    // Initialization in progress
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.doInitialize();
    return this.initializationPromise;
  }
  private async doInitialize(): Promise<void> {
    try {
      this.queue = new Queue<PlatformSyncJob>("platform-sync", {
        redis: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || "6379"),
          password: process.env.REDIS_PASSWORD,
        },
      });

      // Set up queue processing
      this.queue.process("syncInventory", async (job) => {
        return await this.processor.process(job);
      });

      await this.setupEventHandlers();
      this.isInitialized = true;
      console.log("Queue system initialized successfully");
    } catch (error) {
      this.initializationPromise = null;
      this.isInitialized = false;
      throw error;
    }
  }

  private async setupEventHandlers() {
    this.queue.on("completed", async (job) => {
      console.log(`Job ${job.data.jobId} completed successfully`);

      await PlatformSyncRepository.updateStatus(job.data.jobId, {
        status: "completed",
        completedAt: new Date(),
        result: job.returnvalue,
      });

      EventEmitter.emit("platformSync:completed", {
        jobId: job.data.jobId,
        merchantId: job.data.merchantId,
        result: job.returnvalue,
      });
    });

    this.queue.on("failed", async (job, error) => {
      console.error(`Job ${job?.data.jobId} failed:`, error);

      await PlatformSyncRepository.updateStatus(job.data.jobId, {
        status: "failed",
        error: error.message,
        failedAt: new Date(),
      });

      await NotificationService.notifyAdmin({
        type: "SYNC_FAILURE",
        merchantId: job.data.merchantId,
        jobId: job.data.jobId,
        error: error.message,
      });
    });

    this.queue.on("error", (error) => {
      console.error("Queue error:", error);
      ErrorMonitoringService.captureError(error, {
        context: "PlatformSyncQueue",
        level: "error",
      });
    });
  }

  async add(
    jobName: string,
    data: PlatformSyncJob,
    options?: Queue.JobOptions
  ): Promise<Queue.Job<PlatformSyncJob>> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return await this.queue.add(jobName, data, options);
  }

  async getJob(jobId: string): Promise<Queue.Job<PlatformSyncJob> | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return await this.queue.getJob(jobId);
  }

  async getJobStatus(jobId: string): Promise<string | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    const job = await this.getJob(jobId);
    if (!job) return null;
    return await job.getState();
  }
}

export const getQueue = () => PlatformSyncQueue.getInstance();
