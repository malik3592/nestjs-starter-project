import { Module } from '@nestjs/common';
import { SocketService } from './providers/socket.service';
import { SocketGateway } from './gateways/socket.gateway';

@Module({
  providers: [SocketService, SocketGateway],
})
export class SocketModule {}
