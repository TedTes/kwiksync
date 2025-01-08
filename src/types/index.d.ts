declare global {
  interface EmailContent {
    to: string;
    subject: string;
    html: string;
    text?: string;
    attachments?: EmailAttachment[];
  }
  interface EmailAttachment {
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }
  interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    from: string;
  }

  interface s3FileObj {
    bucket: string;
    key: string;
    body: Buffer | Uint8Array | string;
    mimeType: string;
  }

  interface WeeklyRevenue {
    day: string;
    revenue: number;
  }

  interface QueryResult {
    day: string;
    revenue: string;
  }

  interface PlatformMetrics {
    name: string;
    revenue: number;
    growth: number;
    trend: "up" | "down";
    cvr: number;
  }
  interface RecentActivity {
    product: string;
    platform: string;
    change: number;
    stock: number;
  }
}

export {};
