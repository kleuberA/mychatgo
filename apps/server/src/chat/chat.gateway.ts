import { Logger } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface ChatMessage {
  id: string;
  autorDaMensagem: string;
  message: string;
  room: string;
  time: string;
  deleted: boolean;
  emojis: Object[];
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer() io: Server;

  private messages: ChatMessage[] = [];

  afterInit() {
    this.logger.log("Initialized");
  }

  handleConnection(client: Socket, ...args: any[]) {
    const { sockets } = this.io.sockets;
    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  @SubscribeMessage('join_room')
  joinRoom(socket: Socket, roomId: string) {
    socket.join(roomId);
    this.logger.log(`Client id: ${socket.id} joined room: ${roomId}`);

    const welcomeMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      autorDaMensagem: 'System',
      message: 'Bem-vindo ao chat! Lembrando que este chat é temporário. Suas mensagens serão perdidas ao sair ou atualizar a página.',
      room: socket.id,
      time: new Date().toLocaleTimeString(),
      deleted: false,
      emojis: []
    };
    socket.emit('message', welcomeMessage);

    const existingMessages = this.messages.filter(msg => msg.room === roomId);
    existingMessages.forEach(msg => socket.emit('message', msg));
    this.logger.log(`Messages id: ${existingMessages.forEach(msg => socket.emit('message', msg))}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client id: ${client.id} disconnected `);
  }

  @SubscribeMessage("message")
  handleMessage(client: Socket, data: ChatMessage) {
    let message = data;
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.log(`Author: ${message.autorDaMensagem}`);
    this.logger.debug(`Payload: ${JSON.stringify(data)}`);

    this.messages.push(message);

    if (message.room) {
      this.io.to(message.room).emit("message", data);
    } else {
      this.logger.warn(`Client id: ${client.id} is not in any room`);
    }
  }

  @SubscribeMessage('add_emoji')
  addEmoji(socket: Socket, data: { messageId: string, emoji: {} }) {
    this.logger.log(`Client id: ${socket.id} requested to add emoji to message id: ${data.messageId}`);
    const message = this.messages.find(msg => msg.id === data.messageId);
    if (message) {
      message.emojis.push(data.emoji);
      this.io.to(message.room).emit('add_emoji', message);
    } else {
      this.logger.warn(`Client id: ${socket.id} requested to add emoji to a non-existing message id: ${data.messageId}`);
    }
  }

  @SubscribeMessage('delete_message')
  deleteMessage(socket: Socket, messageId: string) {
    this.logger.log(`Client id: ${socket.id} requested to delete message id: ${messageId}`);
    const message = this.messages.find(msg => msg.id === messageId);
    if (message) {
      message.deleted = true;
      message.message = 'Mensagem removida';
      this.io.to(message.room).emit('delete_message', message);
    } else {
      this.logger.warn(`Client id: ${socket.id} requested to delete a non-existing message id: ${messageId}`);
    }
  }
}
