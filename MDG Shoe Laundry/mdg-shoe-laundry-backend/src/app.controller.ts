import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NotificationsService } from './notifications/notifications.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('contact')
  async submitContactMessage(
    @Body() body: { fullName: string; email: string; subject: string; message: string },
  ) {
    const { fullName, email, subject, message } = body || {};

    if (!fullName?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      throw new BadRequestException('Please complete all fields before sending your message.');
    }

    const adminRecipients = (process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'albertmendolza295@gmail.com')
      .split(/[;,]+/)
      .map((value) => value.trim())
      .filter(Boolean);

    const adminHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #f8fafc; padding: 24px;">
        <div style="background: #0f172a; color: white; padding: 24px; border-radius: 12px 12px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">New Contact Request</h2>
          <p style="margin: 8px 0 0; color: #cbd5e1;">A visitor has submitted a message through the website contact form.</p>
        </div>
        <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);">
          <p><strong>Full Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; color: #334155;">${message}</p>
        </div>
      </div>
    `;

    const senderHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #f8fafc; padding: 24px;">
        <div style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); color: white; padding: 24px; border-radius: 12px 12px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">Thank you for contacting MDG Shoe Laundry</h2>
          <p style="margin: 8px 0 0; color: #ccfbf1;">We have received your message and will get back to you shortly.</p>
        </div>
        <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);">
          <p><strong>Hi ${fullName},</strong></p>
          <p>We appreciate your message regarding <strong>${subject}</strong>.</p>
          <p>Our team will review it and respond as soon as possible.</p>
          <p style="margin-top: 16px;"><strong>Your message:</strong></p>
          <p style="white-space: pre-wrap; color: #334155;">${message}</p>
        </div>
      </div>
    `;

    const results = await Promise.all([
      ...adminRecipients.map((recipient) => this.notificationsService.sendEmail(recipient, `New Contact Message: ${subject}`, adminHtmlContent)),
      this.notificationsService.sendEmail(email, 'Thank you for contacting MDG Shoe Laundry', senderHtmlContent),
    ]);

    const failed = results.filter((result) => !result.success);

    if (failed.length > 0) {
      return {
        success: false,
        message: 'Your message could not be sent right now. Please try again later.',
      };
    }

    return {
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.',
    };
  }
}
