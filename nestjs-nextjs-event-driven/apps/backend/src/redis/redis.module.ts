import { Module, Global } from '@nestjs/common';
import { Redis } from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_PUB_CLIENT',
      useFactory: () => {
        const redis = new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        });

        redis.on('connect', () => {
          console.log('✅ Redis Publisher connected');
        });

        redis.on('error', (error) => {
          console.error('❌ Redis Publisher error:', error);
        });

        return redis;
      },
    },
    {
      provide: 'REDIS_SUB_CLIENT',
      useFactory: () => {
        const redis = new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        });

        redis.on('connect', () => {
          console.log('✅ Redis Subscriber connected');
        });

        redis.on('error', (error) => {
          console.error('❌ Redis Subscriber error:', error);
        });

        return redis;
      },
    },
  ],
  exports: ['REDIS_PUB_CLIENT', 'REDIS_SUB_CLIENT'],
})
export class RedisModule {}
