import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);
    console.log('socket connected with id ' + socket.id);

    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
      console.log('socket disconnected with id ' + socket.id);
    });

    // Handle other events and messages from the client
  }

  // Add more methods for handling events, messages, etc.
}
