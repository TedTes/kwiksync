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
}

export {};
