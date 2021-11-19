import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {
    return;
  }

  @ApiOkResponse({ type: User, isArray: true })
  @ApiQuery({ name: `name`, required: false })
  @Get()
  getUsers(@Query('name') name: string): User[] {
    return this.usersService.findAll(name);
  }

  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse()
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): User {
    const user = this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse()
  @Post()
  // ? Could optionally have passed the 'name' property into body to extract the property from the JSON request body
  createUser(@Body() body: CreateUserDTO): User {
    return this.usersService.createUser(body);
  }
}
