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
    pickupLocation?: string;
    phoneNumber?: string;
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
            <p style="margin: 8px 0;"><strong>Total Amount:</strong> <span style="color: #B4E74F; font-weight: bold;">${orderDetails.totalAmount.toLocaleString()} RWF</span></p>
          </div>

          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #92400e;">📍 Pickup Location & Contact Information:</p>
            ${orderDetails.pickupLocation ? `<p style="margin: 5px 0; color: #78350f;"><strong>Pickup Location:</strong> ${orderDetails.pickupLocation}</p>` : ''}
            ${orderDetails.phoneNumber ? `<p style="margin: 5px 0; color: #78350f;"><strong>Your Phone Number:</strong> ${orderDetails.phoneNumber}</p><p style="margin: 5px 0; color: #78350f; font-size: 12px;">We'll use this number to contact you if we have any questions.</p>` : ''}
          </div>

          <div style="background-color: #ecfdf5; border-left: 4px solid #10B981; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #065f46;">✓ What happens next?</p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #047857;">
              <li>We'll carefully inspect your items</li>
              <li>Professional cleaning based on type</li>
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
        select: { id: true, email: true, phone: true },
      });

      if (!user) throw new Error('User not found');

      // Create notification record in database
      const notificationMessage = `Order #${orderDetails.orderNumber} confirmed! Total: ${orderDetails.totalAmount.toLocaleString()} RWF. Scheduled: ${new Date(orderDetails.pickupDate).toLocaleDateString()}`;
      
      await this.prisma.notification.create({
        data: {
          user: { connect: { id: userId } },
          message: notificationMessage,
          type: 'email',
          isRead: false,
        },
      } as any);

      if (user.email) {
        await this.sendOrderConfirmationEmail(user.email, {
          orderNumber: orderDetails.orderNumber,
          totalAmount: orderDetails.totalAmount,
          pickupDate: orderDetails.pickupDate,
          services: orderDetails.services || [],
          pickupLocation: orderDetails.pickupLocation,
          phoneNumber: orderDetails.phoneNumber,
        });
      }

      if (user.phone) {
        const smsMessage = `✓ Order Confirmed! Order #${orderDetails.orderNumber}. Total: ${orderDetails.totalAmount.toLocaleString()} RWF. Scheduled: ${new Date(orderDetails.pickupDate).toLocaleDateString()}. Thank you for choosing MDG Shoe Laundry!`;
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
            <h1 style="margin: 0;"> New Order Received</h1>
          </div>
          <div style="background: white; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <p style="margin: 8px 0;"><strong>Order #:</strong> <span style="color: #0E8FDD; font-weight: bold; font-size: 16px;">${orderDetails.orderNumber}</span></p>
              <p style="margin: 8px 0;"><strong>Customer:</strong> ${orderDetails.customerName}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${orderDetails.customerEmail || 'N/A'}</p>
              <p style="margin: 8px 0;"><strong>Amount:</strong> <span style="color: #B4E74F; font-weight: bold;">$${orderDetails.totalAmount.toFixed(2)}</span></p>
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #92400e;"> Scheduled Pickup & Delivery Location:</p>
              <p style="margin: 5px 0; color: #78350f;"><strong>Delivery Address:</strong> ${orderDetails.pickupLocation || 'Not specified'}</p>
              <p style="margin: 5px 0; color: #78350f;"><strong>Scheduled Pickup:</strong> ${new Date(orderDetails.pickupDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style="margin: 5px 0; color: #78350f;"><strong>Time:</strong> ${new Date(orderDetails.pickupDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              <p style="margin: 5px 0; color: #78350f;"><strong>Note:</strong> After cleaning, shoes will be delivered to this location.</p>
            </div>

            <div style="background-color: #ecfdf5; border-left: 4px solid #10B981; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #065f46;">Services Ordered:</p>
              <ul style="margin: 0; padding-left: 20px; color: #047857;">
                ${(orderDetails.services || []).map(service => `<li>${service}</li>`).join('')}
              </ul>
            </div>
            
            <p style="text-align: center; margin-top: 20px;">
              <a href="${process.env.BACKEND_URL}/admin/orders/${orderDetails.id}" style="background: #0E8FDD; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">View Order Details</a>
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
  async sendOrderReadyNotification(userId: number, pickupDetails?: { location: string; date: Date }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, phone: true, firstName: true },
      });

      if (!user) throw new Error('User not found');

      if (user.email) {
        const pickupLocationInfo = pickupDetails 
          ? `<div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
               <p style="margin: 0 0 10px 0; font-weight: bold; color: #92400e;"> Pickup Information:</p>
               <p style="margin: 5px 0; color: #78350f;"><strong>Location:</strong> ${pickupDetails.location}</p>
               <p style="margin: 5px 0; color: #78350f;"><strong>Date:</strong> ${new Date(pickupDetails.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
               <p style="margin: 5px 0; color: #78350f;"><strong>Time:</strong> ${new Date(pickupDetails.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
             </div>`
          : '';
        
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb;">
            <div style="background: linear-gradient(135deg, #B4E74F 0%, #94C400 100%); color: #000; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">✓ Your Order Is Ready!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your shoes are being prepared for delivery</p>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; color: #1f2937;">Hi ${user.firstName},</p>
              <p style="color: #4b5563;">Great news! Your shoes have been professionally cleaned and are ready for delivery. We'll deliver them to your location soon.</p>
              
              ${pickupLocationInfo}

              <div style="background-color: #dbeafe; border-left: 4px solid #0E8FDD; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                <p style="margin: 0; color: #0369a1;"><strong> Delivery in Progress</strong> Our team will contact you to schedule a convenient delivery time.</p>
              </div>

              <p style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/dashboard/orders" style="background: #0E8FDD; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">View Order Status</a>
              </p>

              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin-top: 20px;">
                <p style="margin: 0; color: #6b7280; font-size: 12px;">Thank you for choosing MDG Shoe Laundry! For any questions, contact us at support@mdgshoelaundry.com</p>
              </div>
            </div>
          </div>
        `;
        await this.sendEmail(user.email, '✓ Your Shoes Are Ready - MDG Shoe Laundry', htmlContent);
      }

      if (user.phone && pickupDetails) {
        const deliveryDateStr = new Date(pickupDetails.date).toLocaleDateString();
        await this.sendSMS(user.phone, `✓ Great news! Your shoes are ready for delivery to ${pickupDetails.location}. We'll contact you shortly to confirm delivery. Thank you for using MDG Shoe Laundry!`);
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

  /**
   * Send order status update notification
   */
  async sendOrderStatusUpdateNotification(userId: number, orderDetails: {
    orderNumber: string;
    status: string;
    pickupLocation: string;
    pickupDate: Date;
  }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, phone: true, firstName: true },
      });

      if (!user) throw new Error('User not found');

      const statusColors = {
        CONFIRMED: { bg: '#dbeafe', border: '#0E8FDD', text: '#0369a1', icon: '✓' },
        IN_PROGRESS: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '⚙️' },
        READY_FOR_DELIVERY: { bg: '#ecfdf5', border: '#10B981', text: '#047857', icon: '🚚' },
        COMPLETED: { bg: '#f0fdf4', border: '#22c55e', text: '#166534', icon: '✓' },
        CANCELLED: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', icon: '✕' },
      };

      const statusInfo = statusColors[orderDetails.status] || statusColors.IN_PROGRESS;
      const statusTitles = {
        CONFIRMED: 'Order Confirmed',
        IN_PROGRESS: 'Order In Progress',
        READY_FOR_DELIVERY: 'Ready for Delivery',
        COMPLETED: 'Order Completed',
        CANCELLED: 'Order Cancelled',
      };

      const statusDescriptions = {
        CONFIRMED: 'Your order has been confirmed and we\'re getting started with the cleaning process.',
        IN_PROGRESS: 'Your shoes are currently being professionally cleaned. We\'re giving them extra care!',
        READY_FOR_DELIVERY: 'Excellent news! Your shoes have been completed and are being prepared for delivery to your location.',
        COMPLETED: 'Thank you for your order! Your shoes have been delivered. We\'d love to hear your feedback - please share a review to help us improve!',
        CANCELLED: 'Your order has been cancelled. If you have any questions, please contact us.',
      };

      if (user.email) {
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb;">
            <div style="background: linear-gradient(135deg, #0E8FDD 0%, #0A5FA0 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">${statusInfo.icon} ${statusTitles[orderDetails.status] || 'Order Update'}</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; color: #1f2937;">Hi ${user.firstName},</p>
              <p style="color: #4b5563; line-height: 1.6;">${statusDescriptions[orderDetails.status] || 'Your order status has been updated.'}</p>
              
              <div style="background-color: ${statusInfo.bg}; border-left: 4px solid ${statusInfo.border}; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 5px 0; color: ${statusInfo.text};"><strong>Order #:</strong> ${orderDetails.orderNumber}</p>
                <p style="margin: 5px 0; color: ${statusInfo.text};"><strong>Status:</strong> ${orderDetails.status}</p>
                <p style="margin: 5px 0; color: ${statusInfo.text};"><strong>Delivery Location:</strong> ${orderDetails.pickupLocation}</p>
                <p style="margin: 5px 0; color: ${statusInfo.text};"><strong>Scheduled Date:</strong> ${new Date(orderDetails.pickupDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>

              <div style="text-align: center; margin: 30px 0; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <a href="${process.env.FRONTEND_URL}/dashboard/orders" style="background: #0E8FDD; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">View Order Status</a>
                ${orderDetails.status === 'COMPLETED' ? `<a href="${process.env.FRONTEND_URL}/services#reviews" style="background: #B4E74F; color: #0A3D0A; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Leave a Review</a>` : ''}
              </div>

              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin-top: 20px;">
                <p style="margin: 0; color: #6b7280; font-size: 12px;">Questions? Contact us at support@mdgshoelaundry.com or call (555) 123-4567</p>
              </div>
            </div>
          </div>
        `;
        await this.sendEmail(user.email, `Order Status Update: ${statusTitles[orderDetails.status]} - Order #${orderDetails.orderNumber}`, htmlContent);
      }

      if (user.phone) {
        const smsMessage = `${statusInfo.icon} ${statusTitles[orderDetails.status]} - Order #${orderDetails.orderNumber}. Check your email or dashboard for details. Thank you!`;
        await this.sendSMS(user.phone, smsMessage);
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending status update notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send order notification to admin email
   */
  async sendAdminOrderNotification(orderDetails: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    totalAmount: number;
    services: string[];
    pickupLocation: string;
    pickupDate: Date;
    orderDate: Date;
  }) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'albertmendolza295@gmail.com';

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0E8FDD 0%, #0A5FA0 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">New Order Received</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">A new order has been placed on MDG Shoe Laundry</p>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #0E8FDD; margin-top: 0; font-size: 20px;">Order Details</h2>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Order Number:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #0E8FDD; font-weight: bold; font-size: 18px;">${orderDetails.orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Customer Name:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${orderDetails.customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Customer Email:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    <a href="mailto:${orderDetails.customerEmail}" style="color: #0E8FDD; text-decoration: none;">${orderDetails.customerEmail}</a>
                  </td>
                </tr>
                ${orderDetails.customerPhone ? `<tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Customer Phone:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    <a href="tel:${orderDetails.customerPhone}" style="color: #0E8FDD; text-decoration: none;">${orderDetails.customerPhone}</a>
                  </td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Services:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${orderDetails.services.join(', ')}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Total Amount:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #B4E74F; font-weight: bold;">${orderDetails.totalAmount.toLocaleString()} RWF</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Pickup Location:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${orderDetails.pickupLocation}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Pickup Date:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${new Date(orderDetails.pickupDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;"><strong>Order Date:</strong></td>
                  <td style="padding: 10px 0; text-align: right;">${new Date(orderDetails.orderDate).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #dbeafe; border-left: 4px solid #0E8FDD; padding: 15px; border-radius: 4px; margin-top: 20px;">
              <p style="margin: 0; color: #0369a1;"><strong>ℹ️ Action Required</strong></p>
              <p style="margin: 10px 0 0 0; color: #0369a1; font-size: 14px;">
                Please log in to the admin dashboard to view the full order details and manage this order.
              </p>
            </div>

            <p style="color: #6b7280; margin-top: 30px; text-align: center; font-size: 14px;">
              This is an automated notification from MDG Shoe Laundry system.
            </p>
          </div>

          <div style="text-align: center; padding: 20px 0; color: #6b7280; font-size: 12px;">
            <p style="margin: 0;">© 2026 MDG Shoe Laundry. All rights reserved.</p>
          </div>
        </div>
      `;

      await this.sendEmail(adminEmail, `New Order #${orderDetails.orderNumber} - MDG Shoe Laundry`, htmlContent);

      return { success: true, message: 'Admin notification sent' };
    } catch (error) {
      console.error('Error sending admin order notification:', error);
      return { success: false, error: error.message };
    }
  }
}