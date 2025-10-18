import { Injectable } from '@nestjs/common';
import { EmailNotificationPort } from 'src/user/application/ports/email-notification.port';

@Injectable()
export class ConsoleEmailAdapter implements EmailNotificationPort {
  async sendActivationEmail(email: string, name: string): Promise<void> {
    console.log(`Sending activation email to ${email} for ${name}`);
  }
}
