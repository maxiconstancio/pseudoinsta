const sgMail = require('@sendgrid/mail');
const config = require('../config/config');
const template = require('../utils/emailTemplate');
/**
 * sendMail function to send email by SendGrid
 * @param {string} toEmail (string)
 * @param {string} subject (string)
 * @param {string} html (string html)
 * @returns (array) -> Response { statusCode: 202, body, headers }
 */
const sendMail = async (req, res) => {
  const  toEmail = req.body.email;
  const subject = template.subject;
  const html = template.html;
  try {
    if (!config.sendgridKey && !config.sendgridVerified) {
      return res.status(500).json('No se pudo procesar el envio, requiere Keys Válidos');
    }
    sgMail.setApiKey(config.sendgridKey);
    const msg = {
      to: toEmail, from: config.sendgridVerified, subject, html,
    };
    await sgMail.send(msg)
    res.status(200).json('Email Send Successfully')
  } catch (error) {
    if (error.response) {
      const { message, code, response } = error;
      const errorSendGrid = {
        message: `No se pudo procesar el envio de correo: ${message}`,
        error: message,
        status: code,
        errors: response.body.errors,
      };
      return res.status(code).json(errorSendGrid);
    }
    throw error;
  }
};

module.exports = sendMail;
