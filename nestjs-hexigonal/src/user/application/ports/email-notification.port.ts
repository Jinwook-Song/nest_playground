export interface EmailNotificationPort {
  sendActivationEmail(email: string, name: string): Promise<void>;
}

export const EMAIL_NOTIFICATION_SERVICE = Symbol('EMAIL_NOTIFICATION_SERVICE');
