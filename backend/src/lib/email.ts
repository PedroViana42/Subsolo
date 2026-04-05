import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // false para usar STARTTLS na porta 587
  family: 4, // FORÇA O USO DE IPv4 para evitar ENETUNREACH
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // Importante para alguns ambientes de nuvem
  }
} as any);

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verifyUrl = `${frontendUrl}?verify=${token}`;

  try {
    const passLen = (process.env.GMAIL_APP_PASSWORD || "").length;
    console.log(`[EMAIL DEBUG]: GMAIL_USER está configurado? ${!!process.env.GMAIL_USER}`);
    console.log(`[EMAIL DEBUG]: PASSWORD presente? ${!!process.env.GMAIL_APP_PASSWORD} | Length: ${passLen}`);
    
    if (passLen > 16) {
      console.warn(`⚠️ [EMAIL WARNING]: Senha tem ${passLen} caracteres. Senhas do Gmail devem ter 16. Verifique se há aspas ou espaços no Render.`);
    }

    console.log(`[EMAIL]: Tentando enviar via SMTP:587 (IPv4) para ${email}...`);
    await transporter.sendMail({
      from: `"Subsolo" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Confirme seu e-mail — Subsolo',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #e4e4e7; border-radius: 16px;">
          <h1 style="color: #a78bfa; font-size: 24px; margin-bottom: 8px;">Bem-vindo ao Subsolo.</h1>
          <p style="color: #71717a; margin-bottom: 32px;">Confirme seu e-mail para receber sua identidade temporária.</p>
          <a href="${verifyUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; letter-spacing: 0.05em;">
            Confirmar E-mail
          </a>
          <p style="color: #52525b; font-size: 12px; margin-top: 32px;">Este link expira em 24 horas. Se você não criou uma conta, ignore este e-mail.</p>
        </div>
      `,
    });
    console.log(`✅ [EMAIL]: Verificação enviada com sucesso para ${email}`);
  } catch (error: any) {
    console.error(`🔥 [EMAIL ERROR]: Falha ao enviar para ${email}:`, error);
    throw new Error(`Falha no serviço de e-mail: ${error.message}`);
  }
}
