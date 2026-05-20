import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import twilio from 'twilio';

@Injectable()
export class NotificationsService {
  private emailTransporter: nodemailer.Transporter;
  private twilioClient: twilio.Twilio | null = null;

  constructor(private prisma: PrismaService) {
    this.initializeEmailService();
    this.initializeSMSService();
  }

  /**
   * Initialize email service with Nodemailer
   */
  private initializeEmailService() {
    this.emailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password',
      },
    });

    this.emailTransporter.verify((error) => {
      if (error) {
        console.error('Email service error:', error);
      } else {
        console.log('✓ Email service ready');
      }
    });
  }

  /**
   * Initialize SMS service with Twilio with safety guards
   */
  private initializeSMSService() {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;

      if (!accountSid || !accountSid.startsWith('AC')) {
        console.warn('⚠️ Twilio Account SID is missing or invalid. SMS notifications will be bypassed.');
        this.twilioClient = null;
        return;
      }

      this.twilioClient = twilio(accountSid, authToken);
      console.log('✓ SMS service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Twilio Service safely:', error.message);
      this.twilioClient = null;
    }
  }

  /**
   * Send email notification
   */
  async sendEmail(to: string, subject: string, htmlContent: string) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@mdgshoelaundry.com',
        to,
        subject,
        html: htmlContent,
      };

      const info = await this.emailTransporter.sendMail(mailOptions);
      console.log('✓ Email sent:', info.response);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send HTML email with professional formatting
   */
  async sendOrderConfirmationEmail(email: string, orderDetails: {
    orderNumber: string;
    totalAmount: number;
    pickupDate: string;
    services: string[];
  }) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0E8FDD 0%, #0A5FA0 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">✓ Order Confirmed</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for choosing MDG Shoe Laundry</p>
        </div>

        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #0E8FDD; margin-top: 0; font-size: 20px;">Order Details</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Order Number:</strong> <span style="color: #0E8FDD; font-size: 18px;">${orderDetails.orderNumber}</span></p>
            <p style="margin: 8px 0;"><strong>Pickup Date:</strong> ${new Date(orderDetails.pickupDate).toLocaleDateString()}</p>
            <p style="margin: 8px 0;"><strong>Services:</strong> ${orderDetails.services.join(', ')}</p>
            <p style="margin: 8px 0; font-size: 20px;"><strong>Total Amount:</strong> <span style="color: #B4E74F; font-weight: bold;">$${orderDetails.totalAmount.toFixed(2)}</span></p>
          </div>

          <div style="background-color: #ecfdf5; border-left: 4px solid #10B981; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #047857;"><strong>✓ What happens next?</strong></p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #047857;">
              <li>We'll carefully inspect your shoes</li>
              <li>Professional cleaning based on shoe type</li>
              <li>Quality check before pickup</li>
              <li>Ready by your requested date</li>
            </ul>
          </div>

          <p style="color: #6b7280; margin-top: 30px; text-align: center; font-size: 14px;">
            Questions? Contact us at support@mdgshoelaundry.com or call (555) 123-4567
          </p>
        </div>

        <div style="text-align: center; padding: 20px 0; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">© 2026 MDG Shoe Laundry. All rights reserved.</p>
        </div>
      </div>
    `;

    return this.sendEmail(email, 'Order Confirmation - MDG Shoe Laundry', htmlContent);
  }

  /**
   * Send SMS notification
   */
  async sendSMS(phoneNumber: string, message: string) {
    try {
      if (!this.twilioClient) {
        console.warn('⚠️ SMS request dropped because Twilio client is uninitialized.');
        return { success: false, error: 'SMS engine disabled' };
      }

      const message_response = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
        to: phoneNumber,
      });

      console.log('✓ SMS sent:', message_response.sid);
      return { success: true, messageSid: message_response.sid };
    } catch (error) {
      console.error('SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * General notification send method
   */
  async sendNotification(userId: number | string, message: string, type: 'email' | 'sms' | 'in-app' = 'in-app') {
    try {
      const numUserId = typeof userId === 'string' ? parseInt(userId) : userId;
      
      const user = await this.prisma.user.findUnique({
        where: { id: numUserId },
        select: { id: true, email: true, phone: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      await this.prisma.notification.create({
        data: {
          user: { connect: { id: numUserId } },
          message,
          type,
          isRead: false,
        },
      } as any);

      if (type === 'email' && user.email) {
        return await this.sendEmail(user.email, 'MDG Shoe Laundry Notification', message);
      } else if (type === 'sms' && user.phone) {
        return await this.sendSMS(user.phone, message);
      }

      return {
        success: true,
        userId: numUserId,
        message: 'Notification sent',
      };
    } catch (error) {
      console.error('Error sending notification:', error);
      return {
        success: false,
        error: 'Failed to send notification',
      };
    }
  }

  /**
   * Send order confirmation to customer (email + SMS)
   */
  async sendOrderConfirmation(userId: number, orderDetails: any) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, phone: true },
      });

      if (!user) throw new Error('User not found');

      if (user.email) {
        await this.sendOrderConfirmationEmail(user.email, {
          orderNumber: orderDetails.orderNumber,
          totalAmount: orderDetails.totalAmount,
          pickupDate: orderDetails.pickupDate,
          services: orderDetails.services || [],
        });
      }

      if (user.phone) {
        const smsMessage = `✓ Order Confirmed! Order #${orderDetails.orderNumber}. Total: $${orderDetails.totalAmount.toFixed(2)}. Pickup: ${new Date(orderDetails.pickupDate).toLocaleDateString()}. Thank you for choosing MDG Shoe Laundry!`;
        await this.sendSMS(user.phone, smsMessage);
      }

      return { success: true, message: 'Order confirmation sent' };
    } catch (error) {
      console.error('Error sending order confirmation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send notification to all admin users about a new order
   */
  async notifyAdmins(orderId: string, orderDetails: any) {
    try {
      const admins = await this.prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true, email: true },
      });

      const adminNotificationEmail = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0E8FDD; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">📦 New Order Received</h1>
          </div>
          <div style="background: white; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <p><strong>Order #:</strong> ${orderDetails.orderNumber}</p>
            <p><strong>Customer:</strong> ${orderDetails.customerName}</p>
            <p><strong>Amount:</strong> $${orderDetails.totalAmount}</p>
            <p><strong>Pickup Date:</strong> ${new Date(orderDetails.pickupDate).toLocaleDateString()}</p>
            <p style="text-align: center; margin-top: 20px;">
              <a href="${process.env.BACKEND_URL}/admin/orders/${orderDetails.id}" style="background: #0E8FDD; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Order Details</a>
            </p>
          </div>
        </div>
      `;

      for (const admin of admins) {
        if (admin.email) {
          await this.sendEmail(admin.email, `New Order #${orderDetails.orderNumber}`, adminNotificationEmail);
        }
      }

      return {
        success: true,
        recipientCount: admins.length,
        message: 'Admin notification sent',
      };
    } catch (error) {
      console.error('Error notifying admins:', error);
      throw new Error('Failed to notify admins');
    }
  }

  /**
   * Send order ready notification
   */
  async sendOrderReadyNotification(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, phone: true },
      });

      if (!user) throw new Error('User not found');

      if (user.email) {
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #B4E74F 0%, #94C400 100%); color: #000; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">✓ Your Shoes Are Ready!</h1>
            </div>
            <div style="background: white; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
              <p>Great news! Your shoes have been professionally cleaned and are ready for pickup.</p>
              <p style="text-align: center; margin-top: 20px;">
                <a href="${process.env.FRONTEND_URL}/dashboard/orders" style="background: #0E8FDD; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Order Status</a>
              </p>
            </div>
          </div>
        `;
        await this.sendEmail(user.email, 'Your Shoes Are Ready - MDG Shoe Laundry', htmlContent);
      }

      if (user.phone) {
        await this.sendSMS(user.phone, '✓ Your shoes are ready for pickup! Visit your dashboard to confirm pickup time. Thank you for using MDG Shoe Laundry!');
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending ready notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send custom SMS notification to customer
   */
  async sendCustomerSMS(phoneNumber: string, message: string) {
    return this.sendSMS(phoneNumber, message);
  }
}