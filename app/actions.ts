"use client";

import { jsPDF } from "jspdf";
import { fetchTopCryptos } from "@/lib/api";

export async function generateCryptoMarketCapPDF(limit : number , chartDataUrl : string) {
  try { 
    console.log("Generating Crypto Market Cap PDF...");

    // Fetch top cryptos
    const cryptoData = await fetchTopCryptos(limit);
    if (!cryptoData || cryptoData.length === 0) {
      throw new Error("No cryptocurrency data available.");
    }

    // Initialize PDF
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    pdf.setFontSize(18);
    pdf.text("Cryptocurrency Market Cap Visualization", pageWidth / 2, 15, { align: "center" });

    // Add chart image
    //console.log("Chart Image Data:", chartDataUrl.substring(0, 100)); // Log first 100 characters
    if (chartDataUrl.startsWith("data:image/png;base64,")) {
      console.log("Adding chart image...");
      
      const base64Data = chartDataUrl.split(",")[1];
      if (!base64Data) {
        throw new Error("Invalid base64 image data.");
      }

      pdf.addImage(chartDataUrl, "PNG", 10, 20, 180, 100); // Adjusted size
    } else {
      console.warn("Invalid chartDataUrl format. Skipping image.");
    }

    // Add Market Cap Data Table
    pdf.setFontSize(12);
    pdf.text("Market Cap Data Table", pageWidth / 2, 140, { align: "center" });

    let yOffset = 150;
    cryptoData.forEach((crypto : any , index : number) => {
      if (yOffset > 270) { 
        pdf.addPage();
        pdf.setFontSize(12); // Reset font size
        yOffset = 20;
      }
      pdf.text(`${index + 1}. ${crypto.name}: $${crypto.market_cap?.toLocaleString() || "N/A"}`, 20, yOffset);
      yOffset += 10;
    });

    // Add timestamp and data source
    const timestamp = new Date().toLocaleString();
    pdf.setFontSize(10);
    pdf.text(`Data source: CoinGecko API | Generated on: ${timestamp}`, pageWidth / 2, 280, { align: "center" });

    // Generate and return PDF Blob
    const pdfBuffer = pdf.output("arraybuffer");
    console.log("PDF generated successfully.");
    return new Blob([pdfBuffer], { type: "application/pdf" });

  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
}
