const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendActivationEmail = async (to, token) => {
  const link = `${process.env.BASE_URL}/auth/activate/${token}`;
  try {
    await resend.emails.send({
      from: 'AppCenar <onboarding@resend.dev>',
      to,
      subject: 'Activa tu cuenta en AppCenar',
      html: `
        <h2>Bienvenido a AppCenar</h2>
        <p>Haz clic en el siguiente enlace para activar tu cuenta:</p>
        <a href="${link}" style="background:#e63946;color:white;padding:10px 20px;text-decoration:none;border-radius:5px">
          Activar cuenta
        </a>
        <p>O copia este enlace: ${link}</p>
      `
    });
    console.log('Correo de activación enviado a:', to);
  } catch (error) {
    console.error('Error enviando correo de activación:', error.message);
  }
};

const sendResetPasswordEmail = async (to, token) => {
  const link = `${process.env.BASE_URL}/auth/reset-password/${token}`;
  try {
    await resend.emails.send({
      from: 'AppCenar <onboarding@resend.dev>',
      to,
      subject: 'Restablecer contraseña - AppCenar',
      html: `
        <h2>Restablecer contraseña</h2>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${link}" style="background:#e63946;color:white;padding:10px 20px;text-decoration:none;border-radius:5px">
          Restablecer contraseña
        </a>
        <p>Este enlace expira en 1 hora.</p>
        <p>O copia este enlace: ${link}</p>
      `
    });
    console.log('Correo de reset enviado a:', to);
  } catch (error) {
    console.error('Error enviando correo reset:', error.message);
  }
};

module.exports = { sendActivationEmail, sendResetPasswordEmail };
const sendResetPasswordEmail = async (to, token) => {
  const link = `${process.env.BASE_URL}/auth/reset-password/${token}`;
  try {
    await transporter.sendMail({
      from: `"AppCenar" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Restablecer contraseña - AppCenar',
      html: `
        <h2>Restablecer contraseña</h2>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${link}" style="background:#e63946;color:white;padding:10px 20px;text-decoration:none;border-radius:5px">
          Restablecer contraseña
        </a>
        <p>Este enlace expira en 1 hora.</p>
        <p>O copia este enlace: ${link}</p>
      `
    });
    console.log('Correo de reset enviado a:', to);
  } catch (error) {
    console.error('Error enviando correo de reset:', error.message);
  }
};

module.exports = { sendActivationEmail, sendResetPasswordEmail };