import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { faker } from '@faker-js/faker';
import { queryParamsDto } from './dto/query.params.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User.name) private usersModel: Model<User>) {}

  async onModuleInit() {
    const count = await this.usersModel.countDocuments();
    console.log('User count:', count);

    if (count === 0) {
      const userList = [];

      for (let i = 0; i < 30000; i++) {
        const user = {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          age: faker.number.int({ min: 18, max: 80 }),
          password: '1234454',
          avatar: faker.image.avatar(),
        };
        userList.push(user);
      }

      console.log(`${userList.length} users added`);
      await this.usersModel.insertMany(userList);
      console.log('succes bro');
    }
  }
  async getUserCount() {
    return { totalUsers: await this.usersModel.countDocuments() };
  }
  async getUsersByAge(age?: number, ageFrom?: number, ageTo?: number, page = 1, take = 10) {
    const filter: any = {};
    if (age !== undefined) {
      filter.age = age;
    } else if (ageFrom !== undefined && ageTo !== undefined) {
      filter.age = { $gte: ageFrom, $lte: ageTo };
    } else if (ageFrom !== undefined) {
      filter.age = { $gte: ageFrom };
    } else if (ageTo !== undefined) {
      filter.age = { $lte: ageTo };
    }

    const limit = Math.min(take, 30); 
    const users = await this.usersModel.find(filter).skip((page - 1) * limit).limit(limit);
    
    return users;
  }

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.usersModel.findOne({
      email: createUserDto.email,
    });
    if (existUser) {
      throw new BadRequestException('User already exists');
    }
    return this.usersModel.create(createUserDto);
  }

  findAll({ page, take }: queryParamsDto) {
    const limit = Math.min(take, 30);
    return this.usersModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);
  }
  deleteAll() {
    return this.usersModel.deleteMany();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid ID format');

    const user = await this.usersModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid ID format');

    const updatedUser = await this.usersModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    if (!updatedUser) throw new NotFoundException('User not found');

    return updatedUser;
  }

  async remove(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid ID format');

    const deletedUser = await this.usersModel.findByIdAndDelete(id);
    if (!deletedUser) throw new NotFoundException('User not found');

    return { message: 'User deleted successfully' };
  }

  async addPost(userId: string, postId: string) {
    const updateUser = await this.usersModel.findByIdAndUpdate(userId, {
      $push: { posts: postId },
    });
    return updateUser;
  }
}
