import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class SocketService {
  // A map to keep track of connected clients using their socket IDs as keys
  private readonly connectedClients: Map<string, Socket> = new Map();

  // Reference to the Socket.IO server instance
  private server: Server;

  /**
   * Sets the Socket.IO server instance for the service.
   * This method should be called when initializing the Socket.IO server.
   *
   * @param server - The Socket.IO server instance
   */
  setServer(server: Server) {
    this.server = server;
  }

  /**
   * Handles a new client connection.
   * Adds the connected client to the `connectedClients` map and sets up event listeners.
   *
   * @param socket - The connected client's Socket.IO instance
   */
  handleConnection(socket: Socket): void {
    const clientId = socket.id; // Unique identifier for the connected client
    this.connectedClients.set(clientId, socket); // Store the client in the map
    console.log('socket connected with id ' + socket.id);

    // Handle client disconnection
    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId); // Remove the client from the map
      console.log('socket disconnected with id ' + socket.id);
    });

    // Additional client-specific event handlers can be added here
  }

  /**
   * Broadcasts an event with data to all connected clients.
   *
   * @param event - The name of the event to broadcast
   * @param data - The data to send with the event
   */
  broadCast(event: string, data: any) {
    if (this.server) {
      this.server.emit(event, data); // Send the event and data to all connected clients
    }
  }

  /**
   * Emits an event with data to a specific client by their socket ID.
   *
   * @param to - The ID of the target client
   * @param event - The name of the event to emit
   * @param data - The data to send with the event
   */
  emit(to: string, event: string, data: any) {
    if (this.server) {
      this.server.to(to).emit(event, data); // Send the event and data to the specified client
    }
  }
}
