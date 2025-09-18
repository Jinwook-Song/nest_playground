'use client';

import { useEffect, useState } from 'react';

/**
 *     {
        "id": "bitcoin",
        "symbol": "btc",
        "name": "Bitcoin",
        "image": "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
        "current_price": 117648,
        "market_cap": 2345541988164,
        "market_cap_rank": 1,
        "fully_diluted_valuation": 2345541988164,
        "total_volume": 60740331108,
        "high_24h": 117815,
        "low_24h": 114940,
        "price_change_24h": 1267.53,
        "price_change_percentage_24h": 1.08913,
        "market_cap_change_24h": 27273074176,
        "market_cap_change_percentage_24h": 1.17644,
        "circulating_supply": 19922421.0,
        "total_supply": 19922421.0,
        "max_supply": 21000000.0,
        "ath": 124128,
        "ath_change_percentage": -5.146,
        "ath_date": "2025-08-14T00:37:02.582Z",
        "atl": 67.81,
        "atl_change_percentage": 173535.37774,
        "atl_date": "2013-07-06T00:00:00.000Z",
        "roi": null,
        "last_updated": "2025-09-18T04:22:20.926Z"
    },
 * 
 */
type Crypto = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: number | null;
  last_updated: string;
};

export default function Home() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    const connectSSE = () => {
      console.log('🔌 SSE 연결 시도...');
      const eventSource = new EventSource('/api/crypto/assets');

      eventSource.onopen = () => {
        console.log('✅ SSE 연결 성공');
        setConnectionStatus('connected');
      };

      eventSource.onmessage = (event) => {
        console.log('📡 데이터 수신:', event.data.substring(0, 100) + '...');
        console.log('📡 이벤트 ID:', event.lastEventId);
        console.log('📡 이벤트 타입:', event.type);

        try {
          const cryptoData = JSON.parse(event.data) as Crypto[];
          console.log('✅ 파싱 성공:', cryptoData.length, '개 코인');
          setCryptos(cryptoData);
          setConnectionStatus('connected');
        } catch (error) {
          console.error('❌ JSON 파싱 에러:', error);
          console.error('❌ 원본 데이터:', event.data);
        }
      };

      eventSource.onerror = (error) => {
        console.error('🚨 SSE 연결 에러:', error);
        setConnectionStatus('disconnected');
        eventSource.close();

        // 5초 후 재연결 시도
        setTimeout(() => {
          console.log('🔄 재연결 시도...');
          setConnectionStatus('connecting');
          connectSSE();
        }, 5000);
      };

      return eventSource;
    };

    const eventSource = connectSSE();

    return () => {
      console.log('🔌 SSE 연결 종료');
      eventSource.close();
    };
  }, []);

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Crypto Dashboard</h1>

        {/* 연결 상태 표시 */}
        <div className='flex items-center gap-2'>
          <div
            className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-success animate-pulse' :
              connectionStatus === 'connecting' ? 'bg-warning animate-pulse' :
              'bg-error'
            }`}
          />
          <span className='text-sm font-medium'>
            {connectionStatus === 'connected' ? '실시간 연결' :
             connectionStatus === 'connecting' ? '연결 중...' :
             '연결 끊김'}
          </span>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'>
        {cryptos.map((crypto) => (
          <div key={crypto.id} className='card bg-base-100 shadow-xl'>
            <div className='card-body'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='avatar'>
                  <div className='w-12 rounded-full'>
                    <img src={crypto.image} alt={crypto.name} />
                  </div>
                </div>
                <div>
                  <h2 className='card-title'>{crypto.name}</h2>
                  <p className='text-sm opacity-70 uppercase'>
                    {crypto.symbol}
                  </p>
                </div>
              </div>

              <div className='stats stats-vertical bg-base-200'>
                <div className='stat'>
                  <div className='stat-title'>Current Price</div>
                  <div className='stat-value text-primary'>
                    ${crypto.current_price?.toLocaleString() ?? 'N/A'}
                  </div>
                  <div
                    className={`stat-desc ${
                      (crypto.price_change_percentage_24h ?? 0) >= 0
                        ? 'text-success'
                        : 'text-error'
                    }`}
                  >
                    {(crypto.price_change_percentage_24h ?? 0) >= 0 ? '↗' : '↘'}{' '}
                    {crypto.price_change_percentage_24h?.toFixed(2) ?? '0.00'}%
                  </div>
                </div>

                <div className='stat'>
                  <div className='stat-title'>Market Cap</div>
                  <div className='stat-value text-sm'>
                    $
                    {crypto.market_cap
                      ? (crypto.market_cap / 1e9).toFixed(2)
                      : '0.00'}
                    B
                  </div>
                  <div className='stat-desc'>
                    Rank #{crypto.market_cap_rank ?? 'N/A'}
                  </div>
                </div>

                <div className='stat'>
                  <div className='stat-title'>24h Volume</div>
                  <div className='stat-value text-sm'>
                    $
                    {crypto.total_volume
                      ? (crypto.total_volume / 1e9).toFixed(2)
                      : '0.00'}
                    B
                  </div>
                </div>
              </div>

              <div className='flex justify-between text-sm mt-4'>
                <div>
                  <span className='text-success'>
                    High: ${crypto.high_24h?.toLocaleString() ?? 'N/A'}
                  </span>
                </div>
                <div>
                  <span className='text-error'>
                    Low: ${crypto.low_24h?.toLocaleString() ?? 'N/A'}
                  </span>
                </div>
              </div>

              <div className='badge badge-outline mt-2'>
                Last updated:{' '}
                {crypto.last_updated
                  ? new Date(crypto.last_updated).toLocaleTimeString()
                  : 'Unknown'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {cryptos.length === 0 && (
        <div className='flex justify-center items-center h-64'>
          <div className='text-center'>
            <span className='loading loading-spinner loading-lg'></span>
            <p className='mt-4 text-lg'>Loading crypto data...</p>
          </div>
        </div>
      )}
    </div>
  );
}
