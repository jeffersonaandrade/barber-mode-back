// @ts-nocheck
const QRCode = require('qrcode');

/**
 * Gera um QR code para entrada na fila
 * @param {string} barbeariaId - ID da barbearia
 * @param {string} token - Token único do cliente
 * @returns {Promise<string>} - Data URL do QR code
 */
async function gerarQRCodeFila(barbeariaId, token) {
  try {
    const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/fila/${barbeariaId}?token=${token}`;
    
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return qrCodeDataURL;
  } catch (error) {
    throw new Error('Erro ao gerar QR code: ' + error.message);
  }
}

/**
 * Gera um QR code para status da fila
 * @param {string} barbeariaId - ID da barbearia
 * @param {string} token - Token único do cliente
 * @returns {Promise<string>} - Data URL do QR code
 */
async function gerarQRCodeStatus(barbeariaId, token) {
  try {
    const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/status/${barbeariaId}?token=${token}`;
    
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return qrCodeDataURL;
  } catch (error) {
    throw new Error('Erro ao gerar QR code: ' + error.message);
  }
}

/**
 * Gera um token único para o cliente
 * @returns {string} - Token único
 */
function gerarToken() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `${timestamp}-${random}`;
}

module.exports = {
  gerarQRCodeFila,
  gerarQRCodeStatus,
  gerarToken
}; 