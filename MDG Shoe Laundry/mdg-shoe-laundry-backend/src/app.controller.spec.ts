import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsService } from './notifications/notifications.service';

describe('AppController', () => {
  let appController: AppController;
  let notificationsService: { sendEmail: jest.Mock };

  beforeEach(async () => {
    notificationsService = {
      sendEmail: jest.fn().mockResolvedValue({ success: true }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: NotificationsService, useValue: notificationsService },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('contact submissions', () => {
    it('should send a confirmation email to the sender after submitting a contact message', async () => {
      const result = await appController.submitContactMessage({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        subject: 'Laundry inquiry',
        message: 'Hello there',
      });

      expect(result.success).toBe(true);
      expect(notificationsService.sendEmail).toHaveBeenCalledWith(
        'jane@example.com',
        expect.stringContaining('Thank you for contacting'),
        expect.any(String),
      );
    });
  });
});
