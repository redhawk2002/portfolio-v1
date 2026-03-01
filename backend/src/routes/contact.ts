import { Router, Request, Response } from 'express';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Initialize MailerSend using the token from .env
const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "",
});

router.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, message } = req.body;

    // 1. Basic Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields! (name, email, message)" });
    }

    // 2. Save "PENDING" message to PostgreSQL Database
    const dbMessage = await prisma.contactMessage.create({
      data: { name, email, message, status: 'PENDING' }
    });

    const senderEmail = process.env.MAILERSEND_SENDER_EMAIL;
    const recipientEmail = process.env.MAILERSEND_RECIPIENT_EMAIL;

    if (!senderEmail || !recipientEmail) {
      console.error("Missing MailerSend email configuration in .env");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    // 3. Construct the Email via MailerSend
    const sentFrom = new Sender(senderEmail, "Portfolio Bot");
    
    const recipients = [
      new Recipient(recipientEmail, "Portfolio Admin")
    ];
    
    // We set the "Reply-To" as the person who filled out the contact form so you can click "Reply" easily
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(new Recipient(email, name))
      .setSubject(`Portfolio Message from ${name}`)
      .setText(message)
      .setHtml(`<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`);

    // 4. Send the Email
    await mailersend.email.send(emailParams);

    // 5. Update DB Status to "SENT" upon success
    await prisma.contactMessage.update({
      where: { id: dbMessage.id },
      data: { status: 'SENT' }
    });

    return res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error: any) {
    console.error("Error sending email:", error?.body ? JSON.stringify(error.body, null, 2) : error);
    return res.status(500).json({ success: false, error: "Failed to send email." });
  }
});

export default router;
