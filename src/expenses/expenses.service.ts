import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expenses } from './schema/expenses.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel('expenses') private expensesModel: Model<Expenses>,
    @InjectModel('user') private userModel: Model<User>,
  ) {}
  async create(userId: number, createExpenseDto: CreateExpenseDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('not found');
    const newExpenses = await this.expensesModel.create({
      ...createExpenseDto,
      user: user._id,
    });
    await this.userModel.findByIdAndUpdate(userId, {
      $push: { expenses: newExpenses._id },
    });
    return newExpenses;
  }

  findAll() {
    return this.expensesModel.find();
  }

  async findOne(id: number) {
    const expense = await this.expensesModel.findById(id);
    if (!expense) throw new BadRequestException('not found');
    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    const updateExpense = await this.expensesModel.findByIdAndUpdate(
      id,
      updateExpenseDto,
      { new: true },
    );
    return updateExpense;
  }

  async remove(id: number) {
    const expenseDelete = await this.expensesModel.findByIdAndDelete(id);
    if (!expenseDelete) throw new BadRequestException('not found id ');
    return expenseDelete;
  }
  
}
