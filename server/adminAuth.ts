import firebaseConfig from '../firebase-applet-config.json';

export interface AdminAuthResult {
  authenticated: boolean;
  uid?: string;
  email?: string;
  isAdmin: boolean;
  adminUidConfigured: boolean;
  configuredUid?: string;
  message?: string;
}

function sanitizeUid(val?: string): string {
  if (!val) return '';
  return val.trim().replace(/^["']|["']$/g, '').trim();
}

export async function verifyAdminRequest(authHeader?: string): Promise<AdminAuthResult> {
  const rawAdminUid = process.env.ADMIN_UID;
  const adminUid = sanitizeUid(rawAdminUid);
  const emailAluno = process.env.EMAIL_ALUNO?.trim().toLowerCase();
  // Email do titular e aluno indicado nos metadados do runtime
  const ownerEmail = 'gui.carapinha@gmail.com';

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      authenticated: false,
      isAdmin: false,
      adminUidConfigured: Boolean(adminUid),
      configuredUid: adminUid || undefined,
      message: 'Cabeçalho de autorização em falta ou inválido (esperado: Bearer <idToken>).',
    };
  }

  const idToken = authHeader.split('Bearer ')[1]?.trim();
  if (!idToken) {
    return {
      authenticated: false,
      isAdmin: false,
      adminUidConfigured: Boolean(adminUid),
      configuredUid: adminUid || undefined,
      message: 'Token de autenticação vazio.',
    };
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        authenticated: false,
        isAdmin: false,
        adminUidConfigured: Boolean(adminUid),
        configuredUid: adminUid || undefined,
        message: 'Token Firebase inválido ou expirado. Por favor termine sessão e entre novamente.',
      };
    }

    const data = await response.json();
    const user = data.users?.[0];

    if (!user || !user.localId) {
      return {
        authenticated: false,
        isAdmin: false,
        adminUidConfigured: Boolean(adminUid),
        configuredUid: adminUid || undefined,
        message: 'Utilizador não encontrado no fornecedor de autenticação Google Firebase.',
      };
    }

    const currentUid = user.localId.trim();
    const currentEmail = (user.email || '').trim().toLowerCase();

    // Verificação de permissões:
    // 1. UID corresponde a ADMIN_UID configurado
    // 2. OU o email corresponde ao email do titular do projeto (Bootstrapped Admin do runtime / EMAIL_ALUNO)
    const matchesUid = Boolean(adminUid && currentUid === adminUid);
    const matchesOwnerEmail = Boolean(currentEmail && (currentEmail === ownerEmail || currentEmail === emailAluno));

    const isAdmin = matchesUid || matchesOwnerEmail;

    let statusMsg = '';
    if (isAdmin) {
      statusMsg = matchesUid
        ? 'Autorização de administrador concedida com sucesso via ADMIN_UID.'
        : `Autorização de administrador concedida para a conta titular (${currentEmail}).`;
    } else {
      if (!adminUid) {
        statusMsg = `Autenticado com sucesso como ${currentEmail}, mas o ADMIN_UID ainda não está configurado. O seu UID é "${currentUid}".`;
      } else {
        statusMsg = `Acesso negado: o seu UID ("${currentUid}") não corresponde ao ADMIN_UID ("${adminUid}").`;
      }
    }

    return {
      authenticated: true,
      uid: currentUid,
      email: currentEmail,
      isAdmin,
      adminUidConfigured: Boolean(adminUid),
      configuredUid: adminUid || undefined,
      message: statusMsg,
    };
  } catch (error: any) {
    console.error('Erro na validação do token Firebase no backend:', error);
    return {
      authenticated: false,
      isAdmin: false,
      adminUidConfigured: Boolean(adminUid),
      configuredUid: adminUid || undefined,
      message: 'Erro interno ao validar credenciais do administrador no servidor.',
    };
  }
}
