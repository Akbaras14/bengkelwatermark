"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [location, setLocation] = useState("");
  const [executionDate, setExecutionDate] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ==============================
  // LOADING SCREEN TIMER
  // ==============================
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // ==============================
  // IMAGE UPLOAD HANDLER
  // ==============================
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setter(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ==============================
  // DRAW WATERMARK
  // ==============================
  const drawWatermark = () => {
    const canvas = canvasRef.current;
    if (!canvas || !mainImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = mainImage;

    img.onload = () => {
      // Retina Safe
      const dpr = window.devicePixelRatio || 1;

      canvas.width = img.width * dpr;
      canvas.height = img.height * dpr;
      canvas.style.width = img.width + "px";
      canvas.style.height = img.height + "px";

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);

      // ==============================
      // RESPONSIVE SCALE SYSTEM
      // ==============================
      const baseWidth = 1200;
      const scale = img.width / baseWidth;

      const padding = 40 * scale;
      const boxPadding = 15 * scale;
      const borderRadius = 20 * scale;

      const primaryFontSize = 24 * scale;
      const lineHeight = primaryFontSize * 1.5;

      const logoSize = 100 * scale;

      const poweredByText = "Powered by Bengkel Watermark";
      const poweredByFontSize = primaryFontSize * 0.7;

      const lines: string[] = [];
      if (jobDescription) lines.push(`Jobdesk: ${jobDescription}`);
      if (officerName) lines.push(`Petugas: ${officerName}`);
      if (location) lines.push(`Lokasi: ${location}`);
      if (executionDate) {
        lines.push(
          `Tanggal: ${new Date(executionDate).toLocaleDateString("id-ID")}`
        );
      }

      if (lines.length === 0) return;

      ctx.font = `bold ${primaryFontSize}px Segoe UI`;

      let maxWidth = 0;
      lines.forEach((line) => {
        maxWidth = Math.max(maxWidth, ctx.measureText(line).width);
      });

      ctx.font = `bold ${poweredByFontSize}px Segoe UI`;
      const poweredByWidth = ctx.measureText(poweredByText).width;

      const effectiveMaxWidth = Math.max(maxWidth, poweredByWidth);

      const boxWidth =
        effectiveMaxWidth +
        boxPadding * 2 +
        (logoImage ? logoSize + 25 * scale : 0);

      const boxHeight =
        lines.length * lineHeight +
        boxPadding * 2 +
        poweredByFontSize +
        20 * scale;

      const boxX = padding;
      const boxY = img.height - boxHeight - padding;

      // ==============================
      // DRAW GLASS BOX
      // ==============================
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 25;

      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxWidth, boxHeight, borderRadius);
      ctx.fill();
      ctx.restore();

      const drawContent = (textStartX: number) => {
        ctx.fillStyle = "white";
        ctx.font = `bold ${primaryFontSize}px Segoe UI`;

        lines.forEach((line, i) => {
          ctx.fillText(
            line,
            textStartX,
            boxY + boxPadding + (i + 1) * lineHeight
          );
        });

        // Accent Line
        const accentHeight = Math.max(2, 3 * scale);
        const accentSpacing = 12 * scale;

        const accentY =
          boxY + boxHeight - poweredByFontSize - accentHeight - accentSpacing;

        ctx.fillStyle = "#FF2D00";
        ctx.fillRect(
          textStartX - boxPadding,
          accentY,
          boxWidth - (textStartX - boxPadding - boxX),
          accentHeight
        );

        // Powered By
        ctx.fillStyle = "white";
        ctx.font = `bold ${poweredByFontSize}px Segoe UI`;
        ctx.fillText(
          poweredByText,
          textStartX,
          accentY + poweredByFontSize + 8 * scale
        );
      };

      if (logoImage) {
        const logo = new Image();
        logo.src = logoImage;

        logo.onload = () => {
          const textStartX = boxX + boxPadding + logoSize + 25 * scale;

          ctx.drawImage(
            logo,
            boxX + boxPadding,
            boxY + boxHeight / 2 - logoSize / 2,
            logoSize,
            logoSize
          );

          drawContent(textStartX);
        };

        logo.onerror = () => drawContent(boxX + boxPadding);
      } else {
        drawContent(boxX + boxPadding);
      }
    };
  };

  useEffect(() => {
    drawWatermark();
  }, [
    mainImage,
    logoImage,
    jobDescription,
    officerName,
    location,
    executionDate,
  ]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "bengkel_watermark.png";
    link.click();
  };

  // ==============================
  // LOADING SCREEN
  // ==============================
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute w-56 h-56 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <img src="/logo.png" className="w-48 h-48 object-contain" />
        </div>

        <h1 className="text-3xl font-semibold mb-2">Bengkel Watermark</h1>

        <div className="flex items-center gap-2 text-lg">
          <span>System sedang dimuat</span>
          <span className="w-3 h-3 bg-green-500 rounded-full animate-blink"></span>
        </div>

        <style jsx>{`
          @keyframes blink {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0;
            }
          }
          .animate-blink {
            animation: blink 1s infinite;
          }
        `}</style>
      </div>
    );
  }

  // ==============================
  // MAIN UI
  // ==============================
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <img src="/logo.png" className="w-52 mb-4" />
      <h1 className="text-3xl font-bold mb-6">Bengkel Watermark</h1>

      <div className="w-full max-w-md space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, setMainImage)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, setLogoImage)}
        />

        <input
          type="text"
          placeholder="Jenis Pekerjaan"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full p-2 rounded text-black"
        />

        <input
          type="text"
          placeholder="Petugas"
          value={officerName}
          onChange={(e) => setOfficerName(e.target.value)}
          className="w-full p-2 rounded text-black"
        />

        <input
          type="text"
          placeholder="Lokasi"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 rounded text-black"
        />

        <input
          type="date"
          value={executionDate}
          onChange={(e) => setExecutionDate(e.target.value)}
          className="w-full p-2 rounded text-black"
        />

        <div className="border p-2 flex justify-center">
          {mainImage ? (
            <canvas ref={canvasRef} className="max-w-full" />
          ) : (
            <p>Upload foto untuk preview</p>
          )}
        </div>

        <button
          onClick={handleDownload}
          className="w-full bg-green-500 py-2 rounded"
          disabled={!mainImage}
        >
          Download
        </button>
      </div>
    </div>
  );
}
