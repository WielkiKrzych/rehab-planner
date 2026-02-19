import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!process.env.SMTP_HOST) {
    console.log('Email not configured - skipping:', options.subject);
    return false;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Rehab Planner <noreply@rehab-planner.example.com>',
      ...options,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

export async function sendDailyCheckinReminder(email: string, patientName: string) {
  return sendEmail({
    to: email,
    subject: 'Przypomnienie o codziennej ocenie - Rehab Planner',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00f0ff;">Rehab Planner</h1>
        <p>Cześć ${patientName}!</p>
        <p>Pamiętaj o wykonaniu dziennej oceny gotowości do treningu.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkin" 
           style="display: inline-block; background: #00f0ff; color: #0a0a0f; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Wykonaj ocenę
        </a>
        <p style="margin-top: 24px; color: #666; font-size: 14px;">
          To automatyczna wiadomość z aplikacji Rehab Planner.
        </p>
      </div>
    `,
  });
}

export async function sendWeeklyReport(email: string, patientName: string, reportSummary: string) {
  return sendEmail({
    to: email,
    subject: `Tygodniowy raport postępów - Rehab Planner`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00f0ff;">Rehab Planner</h1>
        <p>Cześć ${patientName}!</p>
        <p>Oto podsumowanie Twojego tygodnia:</p>
        <div style="background: #1a1a2e; padding: 16px; border-radius: 8px; margin: 16px 0;">
          ${reportSummary}
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reports" 
           style="display: inline-block; background: #00f0ff; color: #0a0a0f; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Zobacz pełny raport
        </a>
      </div>
    `,
  });
}

export async function sendGoalAchieved(email: string, patientName: string, goalName: string) {
  return sendEmail({
    to: email,
    subject: `🎉 Gratulacje! Osiągnięto cel: ${goalName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00ff88;">🎉 Gratulacje, ${patientName}!</h1>
        <p>Doskonale! Osiągnąłeś swój cel rehabilitacji:</p>
        <h2 style="color: #00ff88;">${goalName}</h2>
        <p>To świetny postęp! Kontynuuj pracę nad kolejnymi celami.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/goals" 
           style="display: inline-block; background: #00ff88; color: #0a0a0f; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Zobacz swoje cele
        </a>
      </div>
    `,
  });
}
