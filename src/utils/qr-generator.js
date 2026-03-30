const qrcode = require("qrcode");

class QRCodeGenerator {
  static async generateQRCode(dealId, paymentUrl) {
    try {
      const qrData = `${paymentUrl}?deal=${dealId}`;
      const qrCodeDataUrl = await qrcode.toDataURL(qrData);
      return qrCodeDataUrl;
    } catch (error) {
      console.error("QR Code generation error:", error);
      throw error;
    }
  }

  static async generateQRCodeImage(dealId, paymentUrl) {
    try {
      const qrData = `${paymentUrl}?deal=${dealId}`;
      const qrCodeImage = await qrcode.toBuffer(qrData, {
        errorCorrectionLevel: "H",
        type: "image/png",
        width: 300,
        margin: 2,
      });
      return qrCodeImage;
    } catch (error) {
      console.error("QR Code image generation error:", error);
      throw error;
    }
  }
}

module.exports = QRCodeGenerator;
