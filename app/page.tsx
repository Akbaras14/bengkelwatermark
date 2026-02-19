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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleMainImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setMainImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleLogoImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setLogoImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const drawWatermark = () => {
    const canvas = canvasRef.current;
    if (!canvas || !mainImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = mainImage;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      /* ==============================
         PROFESSIONAL SCALING SYSTEM
      ============================== */
      const referenceSize = 1000;
      const scale = Math.min(img.width, img.height) / referenceSize;

      const padding = 40 * scale;
      const boxPadding = 20 * scale;
      const borderRadius = 22 * scale;

      const primaryFontSize = 26 * scale;
      const lineHeight = primaryFontSize * 1.5;

      const logoSize = 120 * scale;

      const poweredByText = "Powered by Bengkel Watermark";
      const poweredByFontSize = primaryFontSize * 0.7;

      const lines: string[] = [];
      if (jobDescription) lines.push(`Jobdesk: ${jobDescription}`);
      if (officerName) lines.push(`Petugas: ${officerName}`);
      if (location) lines.push(`Lokasi: ${location}`);
      if (executionDate)
        lines.push(
          `Tanggal: ${new Date(executionDate).toLocaleDateString("id-ID")}`
        );

      if (lines.length === 0) return;

      ctx.font = `bold ${primaryFontSize}px 'Segoe UI', sans-serif`;

      let maxWidth = 0;
      lines.forEach((line) => {
        const width = ctx.measureText(line).width;
        if (width > maxWidth) maxWidth = width;
      });

      ctx.font = `bold ${poweredByFontSize}px 'Segoe UI', sans-serif`;
      const poweredWidth = ctx.measureText(poweredByText).width;

      const contentWidth = Math.max(maxWidth, poweredWidth);

      const boxWidth =
        contentWidth + boxPadding * 2 + (logoImage ? logoSize + 25 * scale : 0);

      const boxHeight =
        lines.length * lineHeight +
        boxPadding * 2 +
        poweredByFontSize +
        20 * scale;

      const boxX = padding;
      const boxY = canvas.height - boxHeight - padding;

      /* ==============================
         GLASS BOX
      ============================== */
      ctx.shadowColor = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = 30 * scale;
      ctx.shadowOffsetY = 4 * scale;

      ctx.beginPath();
      ctx.moveTo(boxX + borderRadius, boxY);
      ctx.lineTo(boxX + boxWidth - borderRadius, boxY);
      ctx.quadraticCurveTo(
        boxX + boxWidth,
        boxY,
        boxX + boxWidth,
        boxY + borderRadius
      );
      ctx.lineTo(boxX + boxWidth, boxY + boxHeight - borderRadius);
      ctx.quadraticCurveTo(
        boxX + boxWidth,
        boxY + boxHeight,
        boxX + boxWidth - borderRadius,
        boxY + boxHeight
      );
      ctx.lineTo(boxX + borderRadius, boxY + boxHeight);
      ctx.quadraticCurveTo(
        boxX,
        boxY + boxHeight,
        boxX,
        boxY + boxHeight - borderRadius
      );
      ctx.lineTo(boxX, boxY + borderRadius);
      ctx.quadraticCurveTo(boxX, boxY, boxX + borderRadius, boxY);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(
        boxX,
        boxY,
        boxX + boxWidth,
        boxY + boxHeight
      );
      gradient.addColorStop(0, "rgba(0,0,0,0.55)");
      gradient.addColorStop(1, "rgba(0,0,0,0.35)");

      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.shadowBlur = 0;

      const drawContent = (textStartX: number) => {
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${primaryFontSize}px 'Segoe UI', sans-serif`;

        lines.forEach((line, index) => {
          ctx.fillText(
            line,
            textStartX,
            boxY + boxPadding + index * lineHeight + primaryFontSize
          );
        });

        const accentHeight = 3 * scale;
        const accentY =
          boxY + boxPadding + lines.length * lineHeight + 5 * scale;

        ctx.fillStyle = "#FF2D00";
        ctx.fillRect(
          textStartX - boxPadding,
          accentY,
          contentWidth + boxPadding,
          accentHeight
        );

        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${poweredByFontSize}px 'Segoe UI', sans-serif`;
        ctx.fillText(
          poweredByText,
          textStartX,
          accentY + poweredByFontSize + 10 * scale
        );
      };

      if (logoImage) {
        const logo = new Image();
        logo.crossOrigin = "anonymous";
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

  // Conditional rendering for loading screen
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
        {/* Animated Logo Spinner */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Spinner Background */}
          <div className="absolute w-56 h-56 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>

          {/* Logo */}
          <div className="w-48 h-48  rounded-full flex items-center justify-center shadow-2xl">
            <img
              src="/logo.png"
              alt="Bengkel Watermark Logo"
              className="w-44 h-44 object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold tracking-wide mb-2">
          Bengkel Watermark
        </h1>

        <p className="text-gray-400 mb-4 text-sm text-center tracking-widest uppercase">
          Membuat Watermark Profesional untuk Foto Pekerjaan Anda
        </p>

        {/* SYSTEM LOADING TEXT */}
        <div className="flex items-center gap-2 text-lg font-medium mb-6">
          <span>System sedang dimuat</span>
          <span className="w-3 h-3 bg-green-500 rounded-full animate-blink"></span>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-[loading_2s_linear_infinite]"></div>
        </div>

        <style jsx>{`
          @keyframes loading {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col items-center p-4">
      <div className="flex justify-center">
        <img
          src="/logo.png" // ganti dengan path logo kamu
          alt="Logo Bengkel Watermark"
          className="w-60 h-60 object-contain"
        />
      </div>
      <h1 className="text-3xl text-white font-bold mb-4 text-center">
        Bengkel Watermark
      </h1>

      <div className="w-full max-w-md bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Upload Jobdesk</h2>
        <div className="mb-4">
          <label
            htmlFor="main-image-upload"
            className="block text-sm font-medium text-white-700"
          >
            Upload foto Pekerjaan
          </label>
          <input
            type="file"
            id="main-image-upload"
            accept="image/*"
            onChange={handleMainImageUpload}
            className="mt-1 block w-full text-sm text-white-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="logo-image-upload"
            className="block text-sm font-medium text-white-700"
          >
            Upload foto logo perusahaan (opsional)
          </label>
          <input
            type="file"
            id="logo-image-upload"
            accept="image/*"
            onChange={handleLogoImageUpload}
            className="mt-1 block w-full text-sm text-white-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
      </div>

      <div className="w-full max-w-md bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Deskripsi Pekerjaan</h2>
        <div className="mb-4">
          <label
            htmlFor="job-description"
            className="block text-sm font-medium text-white-700"
          >
            Jenis Pekerjaan
          </label>
          <input
            type="text"
            id="job-description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="officer-name"
            className="block text-sm font-medium text-white-700"
          >
            Petugas
          </label>
          <input
            type="text"
            id="officer-name"
            value={officerName}
            onChange={(e) => setOfficerName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-white-700"
          >
            Lokasi
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        {/* New input field for Execution Date */}
        <div className="mb-4">
          <label
            htmlFor="execution-date"
            className="block text-sm font-medium text-white-700"
          >
            Tanggal Pekerjaan
          </label>
          <input
            type="date"
            id="execution-date"
            value={executionDate}
            onChange={(e) => setExecutionDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      </div>

      <div className="w-full max-w-md bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Preview</h2>
        <div className="border border-gray-300 p-2 rounded-md flex justify-center items-center overflow-hidden">
          {mainImage ? (
            <canvas ref={canvasRef} className="max-w-full h-auto"></canvas>
          ) : (
            <p className="text-gray-500">
              Upload Foto Terlebih Dahulu Untuk Melihat Preview
            </p>
          )}
        </div>
        <button
          onClick={handleDownload}
          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
          disabled={!mainImage}
        >
          Download Foto dengan Watermark
        </button>
      </div>
      <div className="w-full max-w-md bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Tentang Aplikasi Ini</h2>

        <p className="text-gray-400 mb-6">
          Ini adalah aplikasi web sederhana yang dirancang untuk membantu Anda
          menambahkan watermark pada foto dengan detail penting untuk keaslian.
          Anda dapat mengunggah foto utama, menambahkan logo perusahaan, serta
          menyertakan informasi khusus pekerjaan seperti deskripsi pekerjaan,
          nama petugas, lokasi, dan tanggal pelaksanaan. Gambar yang telah
          diberi watermark kemudian dapat diunduh.
        </p>

        {/* Pembuat */}
        <div className="flex items-center gap-4 border-t border-gray-700 pt-4">
          <img
            src="/akbar.jpeg" // ganti dengan path foto kamu
            alt="Foto Pembuat"
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
          />
          <div>
            <h3 className="text-lg font-semibold text-white">
              Akbar Aditiya Sugianto
            </h3>
            <p className="text-sm text-gray-400">Web Developer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
