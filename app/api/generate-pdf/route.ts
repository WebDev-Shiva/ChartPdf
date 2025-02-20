import { type NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer"
import { fetchTopCryptos } from "@/lib/api"

export async function POST(request: NextRequest) {
  try {
    const { limit } = await request.json()

    const cryptoData = await fetchTopCryptos(limit)
    const labels = cryptoData.map((crypto: any) => crypto.name)
    const values = cryptoData.map((crypto: any) => crypto.market_cap)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Set the content of the page
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
          <div style="width: 800px; height: 400px;">
            <canvas id="myChart"></canvas>
          </div>
          <script>
            new Chart(document.getElementById('myChart'), {
              type: 'pie',
              data: {
                labels: ${JSON.stringify(labels)},
                datasets: [{
                  data: ${JSON.stringify(values)},
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(201, 203, 207, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                  ],
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  title: {
                    display: true,
                    text: 'Top Cryptocurrencies by Market Cap',
                  },
                },
              }
            });
          </script>
        </body>
      </html>
    `)

    // Wait for the chart to render
    await page.waitForSelector("#myChart")

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    })

    await browser.close()

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=crypto_market_cap_chart.pdf",
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}

