export async function fetchTopCryptos(limit = 10) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch data from CoinGecko API")
  }

  const data = await response.json()
  return data.map((crypto: any) => ({
    name: crypto.name,
    market_cap: crypto.market_cap,
  }))
}

