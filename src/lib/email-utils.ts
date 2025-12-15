import nodemailer from 'nodemailer';

export async function sendMassEmail(
  recipients: string[],
  subject: string,
  htmlContent: string,
) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
    console.warn('⚠️ Email não enviado: credenciais de e-mail ausentes.');
    return;
  }

  if (recipients.length === 0) {
    console.log('Nenhum destinatário para enviar e-mail.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Organização VIII Olinsesp" <${process.env.GMAIL_USER}>`,
      to: recipients.join(', '),
      subject,
      html: htmlContent,
    });
    console.log(
      `✅ E-mail enviado para ${recipients.length} destinatário(s) com o assunto: "${subject}"`,
    );
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail em massa:', error);
    throw error;
  }
}
