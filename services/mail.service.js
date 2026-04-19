const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendActivationEmail = async (to, token) => {
  const link = `${process.env.BASE_URL}/auth/activate/${token}`;
  await transporter.sendMail({
    from: `"AppCenar" <${process.env.EMAIL_USER}>`,
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
};

const sendResetPasswordEmail = async (to, token) => {
  const link = `${process.env.BASE_URL}/auth/reset-password/${token}`;
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
};

module.exports = { sendActivationEmail, sendResetPasswordEmail };