import { Inject, Post, Get, Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enum/auth-type.enum';

@ApiTags('test')
@Auth(AuthType.None)
@Controller('test')
export class TestController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Post('setCache')
  @ApiOperation({ summary: 'Set cache value' })
  @ApiResponse({ status: 200, description: 'Cache value set successfully.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        key: { type: 'string' },
        value: { type: 'string' },
        time: { type: 'number' },
      },
      required: ['key', 'value', 'time'],
    },
  })
  async setCache(@Body() body: { key: string; value: string; time: number }) {
    try {
      const store = (this.cacheManager as any).store;
      console.log('✅ Active Cache Store:', store?.name || 'Unknown');
      await this.cacheManager.set(body.key, body.value, 60000); // Expires in 30 seconds
      console.log(`Cache set for key: ${body.key}`);
      return { message: 'Cache set successfully' };
    } catch (error) {
      console.error(`Error setting cache for key: ${body.key}`, error);
      return { message: 'Error setting cache' };
    }
  }

  @Post('getCache')
  @ApiOperation({ summary: 'Get cache value' })
  @ApiResponse({
    status: 200,
    description: 'Cache value retrieved successfully.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { key: { type: 'string' } },
      required: ['key'],
    },
  })
  async getCache(@Body() body: { key: string }) {
    const value = await this.cacheManager.get(body.key);
    console.log(`Cache retrieved for key: ${body.key}, value: ${value}`);
    return { message: 'Cache retrieved successfully', data: { value } };
  }
}
