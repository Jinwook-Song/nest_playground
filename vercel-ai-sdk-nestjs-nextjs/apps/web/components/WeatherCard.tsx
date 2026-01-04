interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
}

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return '☀️';
      case 'cloudy':
        return '🌥️';
      case 'rainy':
        return '🌧️';
      case 'snowy':
        return '❄️';
      case 'foggy':
        return '🌫️';
      default:
        return '🌤️';
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-bold text-gray-800'>{data.location}</h2>
        <span className='text-4xl'>{getWeatherIcon(data.condition)}</span>
      </div>

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <span className='text-gray-600'>온도</span>
          <span className='text-3xl font-semibold text-gray-800'>
            {data.temperature}°F
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-gray-600'>상태</span>
          <span className='text-lg capitalize text-gray-800'>
            {data.condition}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-gray-600'>습도</span>
          <span className='text-lg text-gray-800'>{data.humidity}%</span>
        </div>
      </div>
    </div>
  );
}
