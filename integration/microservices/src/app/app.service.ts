import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserRequest } from './create-user-request.dto';
import { CreateUserEvent } from './create-user.event';

@Injectable()
export class AppService {
  private readonly users: any[] = [];

  constructor(
    @Inject('COMMUNICATION') private readonly commuClient: ClientProxy,
  ) {}

  getData(): { message: string } {
    return { message: 'Welcome to microservices!' };
  }

  createUser(createUserRequest: CreateUserRequest) {
    this.users.push(createUserRequest);
    this.commuClient.emit(
      'user_created',
      new CreateUserEvent(createUserRequest.email),
    );
  }
}
