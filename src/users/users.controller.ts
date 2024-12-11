import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './providers/users.service';
import { PaginationQueryDto } from '../common/pagination/dtos/pagination-query.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // @ApiOperation({
  //   summary: 'API end point to create user',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'You get 200 if the user is created successfully',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description:
  //     'You get 400 when user creation failed due to some invalid data',
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'You get 500 for server side error',
  // })
  // @Post()
  // public createUser(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.createUser(createUserDto);
  // }
  // @ApiOperation({
  //   summary: 'API end point to fetch users list',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'You get 200 if successful',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'You get 400 when get failed due to some invalid data',
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'You get 500 for server side error',
  // })
  // @Get()
  // public getAllUser(@Query() paginationQueryDto: PaginationQueryDto) {
  //   return this.usersService.getAllUser(paginationQueryDto);
  // }
  // @ApiOperation({
  //   summary: 'API end point to update user',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'You get 200 if the user is updated successfully',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'You get 400 when user update failed due to some invalid data',
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'You get 500 for server side error',
  // })
  // @Put()
  // public updateUser(@Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.updateUser(updateUserDto);
  // }

  // @ApiOperation({
  //   summary: 'API endpoint to get user',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'User retrieved successfully',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Invalid data',
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'Server error',
  // })
  // @ApiParam({
  //   name: 'id',
  //   description: 'Unique identifier for the user',
  //   example: '66fd8a038f7b2b05045c028b',
  // })
  // @Get('/:id')
  // public getUserById(
  //   @Param('id')
  //   id: string,
  // ) {
  //   return this.usersService.getUserById(id);
  // }

  // @ApiOperation({
  //   summary: 'API endpoint to update user status',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'User status updated successfully',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Invalid data',
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'Server error',
  // })
  // @ApiParam({
  //   name: 'id',
  //   description: 'Unique identifier for the user',
  //   example: '66fd8a038f7b2b05045c028b',
  // })
  // @Patch('/:id')
  // public updateUserStatus(
  //   @Param('id')
  //   id: string,
  // ) {
  //   return this.usersService.updateUserStatus(id);
  // }

  // @ApiOperation({
  //   summary: 'API endpoint to delete user',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'User deleted successfully',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Invalid data',
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'Server error',
  // })
  // @ApiParam({
  //   name: 'id',
  //   description: 'Unique identifier for the user',
  //   example: '66fd8a038f7b2b05045c028b',
  // })
  // @Delete('/:id')
  // public deleteUser(
  //   @Param('id')
  //   id: string,
  // ) {
  //   return this.usersService.deleteUser(id);
  // }
}
