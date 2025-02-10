import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { queryParamsDto } from './dto/query.params.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Get('/count')
  async getUserCount() {
    return this.usersService.getUserCount();
  }
  @Get('/by-age')
  async getUsersByAge(
    @Query('age') age?: number,
    @Query('ageFrom') ageFrom?: number,
    @Query('ageTo') ageTo?: number,
    @Query('page') page = 1,
    @Query('take') take = 10,
  ) {
    return this.usersService.getUsersByAge(
      age,
      ageFrom,
      ageTo,
      Number(page),
      Number(take),
    );
  }

  @Get()
  findAll(@Query() queryParams: queryParamsDto) {
    console.log(queryParams);
    return this.usersService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  @Delete('delete-all')
  async deleteAllUsers() {
    return this.usersService.deleteAll();
  }
}
