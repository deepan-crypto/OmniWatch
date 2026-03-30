import React, { useRef, useEffect, useState } from 'react';

const CanvasAdGenerator = ({ deal }) => {
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (!deal) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 400;

    canvas.width = width;
    canvas.height = height;

    // Load and draw background image
    if (deal.imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = deal.imageUrl;

      img.onload = () => {
        // Draw image with aspect ratio fitting
        ctx.drawImage(img, 0, 0, width, height);
        drawOverlay(ctx, width, height, deal);
      };

      img.onerror = () => {
        // If image fails, use gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#FF6B35');
        gradient.addColorStop(1, '#004E89');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        drawOverlay(ctx, width, height, deal);
      };
    } else {
      // Fallback gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#FF6B35');
      gradient.addColorStop(1, '#004E89');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      drawOverlay(ctx, width, height, deal);
    }
  }, [deal]);

  const drawOverlay = (ctx, width, height, deal) => {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, width, height);

    // Discount badge (top right)
    const badgeSize = 80;
    ctx.fillStyle = '#FF1744';
    ctx.beginPath();
    ctx.arc(width - badgeSize / 2, badgeSize / 2, badgeSize / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(deal.discountPercentage + '%', width - badgeSize / 2, badgeSize / 2 - 8);
    ctx.font = 'bold 14px Arial';
    ctx.fillText('OFF', width - badgeSize / 2, badgeSize / 2 + 12);

    // Price section (bottom)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(0, height - 120, width, 120);

    // Item name
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(deal.itemName, 30, height - 105);

    // Price details
    ctx.font = '16px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText(`Original: ₹${deal.originalPrice}`, 30, height - 70);

    ctx.fillStyle = '#00AA00';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Now: ₹${deal.finalPrice}`, 30, height - 40);

    // Merchant name (top left)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(deal.merchantName, 20, 20);

    ctx.font = '14px Arial';
    ctx.fillStyle = '#EEEEEE';
    ctx.fillText(deal.location, 20, 45);

    // QR code placeholder (bottom right)
    if (deal.qrCode) {
      const qrImg = new Image();
      qrImg.src = deal.qrCode;
      qrImg.onload = () => {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(width - 110, height - 110, 100, 100);
        ctx.drawImage(qrImg, width - 105, height - 105, 90, 90);
      };
    }

    // Convert canvas to image
    const imageData = canvas.toDataURL('image/png');
    setImageSrc(imageData);
  };

  const downloadAd = () => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `${deal.itemName}-deal.png`;
    link.click();
  };

  return (
    <div className="canvas-ad-container">
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} style={{ border: '2px solid #ddd', borderRadius: '8px' }} />
      </div>
      {imageSrc && (
        <div className="ad-actions">
          <button onClick={downloadAd} className="btn btn-primary">
            Download Ad
          </button>
          <button onClick={() => window.open(imageSrc, '_blank')} className="btn btn-secondary">
            View Full Size
          </button>
        </div>
      )}
    </div>
  );
};

export default CanvasAdGenerator;
