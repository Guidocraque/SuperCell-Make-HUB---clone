import { Resend } from 'resend';
import { NotificacaoAluno, Proposta } from '../src/types/proposta';

export async function enviarNotificacaoAlunoResend(
  proposta: Proposta
): Promise<NotificacaoAluno> {
  const apiKey = process.env.RESEND_API_KEY;
  const emailAluno = process.env.EMAIL_ALUNO;

  if (!apiKey) {
    return {
      estado: 'Não configurado',
      dataTentativa: new Date().toISOString(),
      erro: 'Falta configurar a variável RESEND_API_KEY no servidor (painel de Secrets).',
    };
  }

  if (!emailAluno) {
    return {
      estado: 'Não configurado',
      dataTentativa: new Date().toISOString(),
      erro: 'Falta configurar a variável EMAIL_ALUNO com o email associado à sua conta Resend.',
    };
  }

  try {
    const resend = new Resend(apiKey);

    const safeLink = proposta.linkAcesso && !proposta.linkAcesso.includes('super-cell-make-hub-clone.vercel.app')
      ? proposta.linkAcesso
      : `https://supercell-make-hub.ai.studio/proposta/${proposta.token}`;

    const subject = `Nova proposta gerada — Supercell Make HUB (${proposta.numeroProposta})`;

    const comentarioHtml = proposta.comentarioAdmin
      ? `<div style="background-color: #1e1b4b; border: 1px solid #4338ca; border-radius: 6px; padding: 10px 14px; margin: 12px 0 0 0;">
          <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #a5b4fc;">Comentário do Administrador:</p>
          <p style="margin: 0; font-size: 13px; color: #e0e7ff; line-height: 1.4;">${proposta.comentarioAdmin}</p>
        </div>`
      : '';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 28px; border: 1px solid #334155;">
    <div style="border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 20px;">
      <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #818cf8; background-color: rgba(99,102,241,0.15); padding: 4px 10px; border-radius: 9999px;">
        Notificação Interna de Aula
      </span>
      <h1 style="color: #ffffff; font-size: 20px; margin: 12px 0 4px 0;">Nova proposta comercial gerada</h1>
      <p style="color: #94a3b8; font-size: 14px; margin: 0;">Supercell Make HUB — Plataforma de Criação 3D</p>
    </div>

    <p style="font-size: 15px; line-height: 1.5; color: #e2e8f0;">
      Foi submetido um novo pedido na landing page que foi interpretado com sucesso pela IA e calculado pelo catálogo comercial.
    </p>

    <div style="background-color: #0f172a; border-radius: 8px; padding: 16px; margin: 20px 0; border-left: 4px solid #6366f1;">
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #94a3b8;">Número da Proposta: <strong style="color: #f8fafc;">${proposta.numeroProposta}</strong></p>
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #94a3b8;">Âmbito: <span style="color: #e2e8f0;">${proposta.resumoAmbito}</span></p>
      <p style="margin: 0; font-size: 13px; color: #94a3b8;">Total sem IVA: <strong style="color: #38bdf8;">${(proposta.totalCentimos / 100).toFixed(2).replace('.', ',')} €</strong></p>
      ${comentarioHtml}
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${safeLink}" style="display: inline-block; background-color: #6366f1; color: #ffffff; font-weight: 600; font-size: 15px; padding: 12px 24px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(99,102,241,0.3);">
        Consultar proposta
      </a>
    </div>

    <p style="font-size: 12px; color: #94a3b8; line-height: 1.4;">
      Se o botão acima não funcionar, aceda através do link direto em texto:<br>
      <a href="${safeLink}" style="color: #818cf8; word-break: break-all;">${safeLink}</a>
    </p>

    <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0 16px 0;">
    <p style="font-size: 11px; color: #64748b; margin: 0; text-align: center;">
      Modo de aula: esta notificação é enviada unicamente para o email do aluno titular da conta Resend. Os clientes nunca recebem emails.
    </p>
  </div>
</body>
</html>
    `;

    const textContent = `
Nova proposta gerada — Supercell Make HUB
Referência / Número: ${proposta.numeroProposta}
Âmbito: ${proposta.resumoAmbito}
Total sem IVA: ${(proposta.totalCentimos / 100).toFixed(2).replace('.', ',')} €
${proposta.comentarioAdmin ? `Comentário do Administrador: ${proposta.comentarioAdmin}\n` : ''}
Consultar proposta:
${safeLink}

Modo de aula: Notificação enviada exclusivamente ao aluno (${emailAluno}).
    `.trim();

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: emailAluno,
      subject,
      html: htmlContent,
      text: textContent,
    });

    if (response.data && response.data.id) {
      return {
        estado: 'Aceite pelo serviço',
        identificadorServico: response.data.id,
        emailDestino: emailAluno,
        dataTentativa: new Date().toISOString(),
      };
    }

    if (response.error) {
      return {
        estado: 'Falhou',
        erro: response.error.message || JSON.stringify(response.error),
        emailDestino: emailAluno,
        dataTentativa: new Date().toISOString(),
      };
    }

    return {
      estado: 'Falhou',
      erro: 'A API Resend não devolveu identificador de mensagem nem erro explícito.',
      emailDestino: emailAluno,
      dataTentativa: new Date().toISOString(),
    };
  } catch (error: any) {
    const errorMsg = error?.message || 'Erro inesperado ao contactar a API do Resend.';
    return {
      estado: 'Falhou',
      erro: errorMsg,
      emailDestino: emailAluno,
      dataTentativa: new Date().toISOString(),
    };
  }
}
