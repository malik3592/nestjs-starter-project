import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';
import { TestController } from './test.controller';
// import { memoryStore } from 'cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            createKeyv('redis://18.153.74.188:6379'),
          ],
        };
      },
    }),
    // CacheModule.register({
    //   // store: memoryStore, // Use in-memory store
    //   ttl: 100000, // Cache time-to-live in seconds
    //   max: 200000, // Max cache items
    // }),
    // CacheModule.registerAsync({
    //   useFactory: async () => {
    //     const store = await redisStore({
    //       socket: {
    //         host: '127.0.0.1', // Change to your Redis host
    //         port: 6379,
    //       },
    //       ttl: 30000, // Set expiration time
    //     });
    //     return {
    //       store, // ✅ Use the correct store reference
    //       isGlobal: true, // Optional: Makes cache available globally
    //     };
    //   },
    // }),
  ],
  controllers: [TestController],
})
export class TestModule {}
