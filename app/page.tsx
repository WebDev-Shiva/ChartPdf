"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateCryptoMarketCapPDF } from "./actions"
import { PieChart } from "@/components/pie-chart"
import { fetchTopCryptos } from "@/lib/api"

export default function Home() { 
  const [limit, setLimit] = useState<number>(10)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [chartData, setChartData] = useState<{ labels: string[]; values: number[] } | null>(null)
  const [chartDataUrl, setChartDataUrl] = useState<string | null>(null)

  const handleGenerateChart = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const cryptoData = await fetchTopCryptos(limit)
      const labels = cryptoData.map((crypto: any) => crypto.name)
      const values = cryptoData.map((crypto: any) => crypto.market_cap)
      setChartData({ labels, values })
    } catch (error) {
      setError("Error fetching cryptocurrency data. Please try again.")
    } finally {
      setIsLoading(false)
      
    }
  }

  const handleGeneratePDF = async () => {
   console.log("a")
    if (!chartDataUrl) {
      setError("Please generate the chart first.")
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      console.log("bb")
      console.log('chartDataurl', chartDataUrl)
      const pdfBlob = await generateCryptoMarketCapPDF(limit, chartDataUrl)

      // Create a download link for the PDF
      console.log("cc")
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      console.log("d")
      link.href = url
      link.download = "crypto_market_cap_chart.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      setError("Error generating PDF. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cryptocurrency Market Cap Chart Generator</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="limit">Number of Top Cryptocurrencies</Label>
          <Input
            id="limit"
            type="number"
            min="1"
            max="100"
            value={limit}
            onChange={(e) => setLimit(Number.parseInt(e.target.value))}
          />
        </div>
        <Button onClick={handleGenerateChart} disabled={isLoading}>
          {isLoading ? "Generating Chart..." : "Generate Chart"}
        </Button>
        {chartData && (
          <div>
            <PieChart data={chartData} onChartGenerated={setChartDataUrl} />
            <Button onClick={handleGeneratePDF} disabled={isLoading || !chartDataUrl} className="mt-4">
              {isLoading ? "Generating PDF..." : "Generate PDF"}
            </Button>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  )
}

