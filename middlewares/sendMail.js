const sgMail = require('@sendgrid/mail');
const config = require('../config/config');

/**
 * sendMail function to send email by SendGrid
 * @param {string} toEmail (string)
 * @param {string} subject (string)
 * @param {string} html (string html)
 * @returns (array) -> Response { statusCode: 202, body, headers }
 */
const sendMail = async (toEmail, subject, html) => {
  try {
    if (!config.sendgridKey && !config.sendgridVerified) {
      throw new Error('No se pudo procesar el envio, requiere Keys Válidos');
    }
    sgMail.setApiKey(config.sendgridKey);
    const msg = {
      to: toEmail, from: config.sendgridVerified, subject, html,
    };
    return await sgMail.send(msg);
  } catch (error) {
    if (error.response) {
      const { message, code, response } = error;
      const errorSendGrid = {
        message: `No se pudo procesar el envio de correo: ${message}`,
        error: message,
        status: code,
        errors: response.body.errors,
      };
      throw errorSendGrid;
    }
    throw error;
  }
};

module.exports = sendMail;
