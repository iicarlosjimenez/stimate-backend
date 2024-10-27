require('dotenv').config();
const nodemailer = require('nodemailer');
const CreateError = require('./CreateError');

// Configuración del transporter con las variables de entorno de Hostinger
const transporter = nodemailer.createTransport({
   host: process.env.MAIL_HOST,
   port: parseInt(process.env.MAIL_PORT),
   secure: true, // true para puerto 465
   auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
   },
   debug: true, // Habilita logs detallados
   logger: true // Habilita logging
});

// Función de utilidad para enviar correos
const sendEmail = async ({ to, subject, text, html }) => {
   if (!to || !subject || (!text && !html)) {
      throw new CreateError(500, 'Faltan campos requeridos (to, subject, y text o html)');
   }

   try {
      await transporter.verify();

      // Preparamos el mensaje con todos los campos explícitos
      const mailOptions = {
         from: {
            name: 'Stimate',
            address: process.env.MAIL_USERNAME
         },
         to: to,
         subject: subject,
         text: text || '',
         html: html || '',
         headers: {
            'X-Priority': '1', // Alta prioridad
            'X-MSMail-Priority': 'High',
            'Importance': 'high',
            'List-Unsubscribe': `<mailto:${process.env.MAIL_USERNAME}?subject=unsubscribe>`,
            'Message-ID': `<${Date.now()}@kodinc.dev>`
         },
         envelope: {
            from: process.env.MAIL_USERNAME,
            to: to
         },
         encoding: 'utf-8',
         priority: 'high'
      };

      const messageId = `<${Date.now()}-${Math.random().toString(36).substring(2, 15)}@kodinc.dev>`;
      mailOptions.messageId = messageId;

      const info = await transporter.sendMail(mailOptions);

      return {
         messageId: info.messageId,
         accepted: info.accepted,
         response: info.response,
         envelope: info.envelope
      };
   } catch (error) {
      console.error("Error detallado al enviar email:", {
         code: error.code,
         command: error.command,
         response: error.response,
         responseCode: error.responseCode
      });
      throw new CreateError(500, `Error al enviar email: ${error.message}`);
   }
};

module.exports = sendEmail;
