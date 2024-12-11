import { Module } from '@nestjs/common';
import { EncryptionsController } from './encryptions.controller';
import { EncryptionsService } from './providers/encryptions.service';

@Module({
  controllers: [EncryptionsController],
  providers: [EncryptionsService]
})
export class EncryptionsModule {}
