import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private usersModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.usersModel.findOne({
      email: createUserDto.email,
    });
    if (existUser) {
      throw new BadRequestException('user already exists');
    }
    return this.usersModel.create(createUserDto);
  }

  findAll() {
    return this.usersModel.find();
  }

  async findOne(id: number) {
    if (!isValidObjectId(id)) throw new BadRequestException('id not found');

    const user = await this.usersModel.findById(id);
    if (!user) throw new NotFoundException('user not founddd');

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) throw new BadRequestException('uncorrect id');

    const updatedUser = await this.usersModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    if (!updatedUser) throw new NotFoundException('user not found');

    return updatedUser;
  }

  async remove(id: number) {
    if (!isValidObjectId(id)) throw new BadRequestException('uncorerct id');

    const deletedUser = await this.usersModel.findByIdAndDelete(id);
    if (!deletedUser) throw new NotFoundException('not found');

    return { message: 'deleted succesfuly' };
  }
}
