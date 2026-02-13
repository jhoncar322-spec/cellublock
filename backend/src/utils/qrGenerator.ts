import QRCode from 'qrcode';

export interface QRGenerationOptions {
  enrollmentToken: string;
  enrollmentUrl?: string;
}

export const generateQRCode = async (options: QRGenerationOptions): Promise<string> => {
  const { enrollmentToken, enrollmentUrl } = options;
  
  const enrollmentData = {
    token: enrollmentToken,
    url: enrollmentUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/enroll`,
    timestamp: new Date().toISOString()
  };
  
  const dataString = JSON.stringify(enrollmentData);
  
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(dataString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 400,
      margin: 2
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};
