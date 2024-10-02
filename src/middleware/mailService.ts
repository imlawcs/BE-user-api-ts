import nodemailer from 'nodemailer';

interface EmailOptions {
  emailFrom: string;
  emailTo: string;
  emailSubject: string;
  emailText: string;
}

const mailService = {
  async sendEmail({ emailFrom, emailTo, emailSubject, emailText }: EmailOptions): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT), 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      text: emailText,
    });
  }
};

// Đảm bảo rằng mailService không thể thay đổi
Object.freeze(mailService);

export default mailService;
