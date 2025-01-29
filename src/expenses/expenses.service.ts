import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expenses } from './schema/expenses.schema';
import { Model } from 'mongoose';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expenses.name) private expensesModel: Model<Expenses>,
  ) {}
  create(createExpenseDto: CreateExpenseDto) {
    return this.expensesModel.create(createExpenseDto);
  }

  findAll() {
    return this.expensesModel.find();
  }

  async findOne(id: number) {
    const expense = await this.expensesModel.findById(id)
    if (!expense) throw new BadRequestException("not found")
    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    const updateExpense = await this.expensesModel.findByIdAndUpdate (
      id,
      updateExpenseDto,
      { new: true },
    )
    return updateExpense;
  }

   async remove(id: number) {
    const expenseDelete = await this.expensesModel.findByIdAndDelete(id)
    if(!expenseDelete) throw new BadRequestException("not found id ")
    return expenseDelete;
  }

}
