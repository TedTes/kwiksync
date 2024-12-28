import { AppDataSource } from "../config";
import { Notification } from "../models/notification.model";

const notificationRepository = AppDataSource.getRepository(Notification);

export const saveNotification = async (merchantId: string, message: string) => {
  const notification = notificationRepository.create({ merchantId, message });
  return await notificationRepository.save(notification);
};
