import React, { useEffect, useRef, useState } from 'react';

export default function PaytmAdGenerator({ aiDealData }) {
    const canvasRef = useRef(null);
    const [isRendering, setIsRendering] = useState(true);

    // Mock data if aiDealData isn't passed yet
    const data = aiDealData || {
        selected_item: "Chicken Biryani",
        discount_offer: "Flat ₹50 OFF",
        merchant_name: "Coimbatore Spice House",
        background_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=600&fit=crop", // Mock DALL-E image
        qr_code_url: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=paytm://upi/pay?pa=merchant@paytm"
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');

        // Helper function to load images
        const loadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "Anonymous"; // Crucial for exporting canvas later
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };

        const drawAd = async () => {
            setIsRendering(true);
            try {
                // 1. Draw Background (The AI Image)
                const bgImg = await loadImage(data.background_url);
                ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

                // 2. Draw Dark Overlay for Text Readability
                ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // 3. Draw Paytm Blue Header Bar
                ctx.fillStyle = "#002970"; // Paytm Dark Blue
                ctx.fillRect(0, 0, canvas.width, 80);

                // 4. Draw Merchant Name
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 28px Arial";
                ctx.textAlign = "center";
                ctx.fillText(data.merchant_name, canvas.width / 2, 50);

                // 5. Draw The AI Offer (No Hallucinations, hardcoded via canvas)
                ctx.fillStyle = "#00BAF2"; // Paytm Light Blue
                ctx.font = "bold 60px Arial";
                ctx.fillText(data.discount_offer, canvas.width / 2, 200);

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "35px Arial";
                ctx.fillText(`on ${data.selected_item}`, canvas.width / 2, 260);

                // 6. Draw the QR Code
                const qrImg = await loadImage(data.qr_code_url);
                // Draw white background for QR
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect((canvas.width / 2) - 85, 345, 170, 170);
                ctx.drawImage(qrImg, (canvas.width / 2) - 75, 355, 150, 150);

                // 7. Call to Action
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 24px Arial";
                ctx.fillText("Scan & Pay via Paytm", canvas.width / 2, 560);

                setIsRendering(false);
            } catch (err) {
                console.error("Canvas drawing failed:", err);
                setIsRendering(false);
            }
        };

        drawAd();
    }, [data]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `paytm-offer-${data.selected_item.replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div style={{
            maxWidth: '400px',
            margin: '0 auto',
            backgroundColor: '#f3f4f6',
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Mock Paytm Mini App Header */}
            <div style={{ backgroundColor: '#002970', padding: '15px', color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                <span style={{ color: '#00BAF2' }}>Paytm</span> for Business
            </div>

            <div style={{ padding: '20px' }}>
                <h3 style={{ color: '#333', marginTop: 0 }}>Generated ONDC Flash Deal</h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                    Your Vyapar AI has generated this brand-safe asset. Download and share it instantly.
                </p>

                {/* The HTML5 Canvas */}
                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                    {isRendering && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                            <span style={{ color: '#002970', fontWeight: 'bold' }}>Rendering Asset...</span>
                        </div>
                    )}
                    <canvas 
                        ref={canvasRef} 
                        width={600} 
                        height={600} 
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                </div>

                <button 
                    onClick={handleDownload}
                    disabled={isRendering}
                    style={{
                        width: '100%',
                        padding: '15px',
                        backgroundColor: '#00BAF2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginTop: '20px',
                        cursor: isRendering ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 6px rgba(0, 186, 242, 0.2)'
                    }}>
                    Download Ad to Phone
                </button>
            </div>
        </div>
    );
}
