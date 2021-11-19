import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [{ id: 0, name: 'Dom' }];

  findAll(name?: string) {
    if (name) {
      return this.users.filter((user) => user.name === name);
    }

    return this.users;
  }

  findById(userId: number) {
    return this.users.find((user) => user.id === userId);
  }

  createUser(createUserDTO: CreateUserDTO) {
    const newUser: User = { id: Date.now(), ...createUserDTO };

    this.users.push(newUser);

    return newUser;
  }
}
