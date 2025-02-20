"use client"

import { useEffect, useRef } from "react"
import { Chart, type ChartConfiguration } from "chart.js/auto"

interface PieChartProps {
  data: {
    labels: string[]
    values: number[]
  }
  onChartGenerated: (dataUrl: string) => void
}

export function PieChart({ data, onChartGenerated }: PieChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy()
        }

        const config: ChartConfiguration = {
          type: "pie",
          data: {
            labels: data.labels,
            datasets: [
              {
                data: data.values,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.8)",
                  "rgba(54, 162, 235, 0.8)",
                  "rgba(255, 206, 86, 0.8)",
                  "rgba(75, 192, 192, 0.8)",
                  "rgba(153, 102, 255, 0.8)",
                  "rgba(255, 159, 64, 0.8)",
                  "rgba(201, 203, 207, 0.8)",
                  "rgba(255, 205, 86, 0.8)",
                  "rgba(75, 192, 192, 0.8)",
                  "rgba(54, 162, 235, 0.8)",
                ],
              },
            ],
          },
          options: {
            responsive: false,
            plugins: {
              legend: {
                position: "right",
                labels: {
                  boxWidth: 15,
                  font: {
                    size: 10,
                  },
                },
              },
              title: {
                display: true,
                text: "Top Cryptocurrencies by Market Cap",
                font: {
                  size: 16,
                },
              },
            },
          },
        }

        chartInstance.current = new Chart(ctx, config)

        // Generate data URL and pass it to the parent component
        const dataUrl = chartRef.current.toDataURL("image/png")
        onChartGenerated(dataUrl)
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, onChartGenerated])

  return <canvas ref={chartRef} width={600} height={400} />
}

