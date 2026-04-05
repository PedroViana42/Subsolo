import { Resend } from 'resend';

// Inicializa o Resend com a API KEY
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verifyUrl = `${frontendUrl}?verify=${token}`;

  try {
    console.log(`[EMAIL DEBUG]: RESEND_API_KEY presente? ${!!process.env.RESEND_API_KEY}`);
    console.log(`[EMAIL]: Tentando enviar via API (Resend) para ${email}...`);

    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY não configurada no Render.");
    }

    const { data, error } = await resend.emails.send({
      from: 'Subsolo <onboarding@resend.dev>', // Use este para testes ou configure seu domínio no Resend
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

    if (error) {
      throw new Error(error.message);
    }

    console.log(`✅ [EMAIL]: Verificação enviada via API para ${email} (ID: ${data?.id})`);
  } catch (error: any) {
    console.error(`🔥 [EMAIL API ERROR]: Falha ao enviar para ${email}:`, error);
    throw new Error(`Falha no serviço de e-mail (API): ${error.message}`);
  }
}
