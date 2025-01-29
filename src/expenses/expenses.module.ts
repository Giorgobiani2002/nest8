import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Expenses, expensesSchema } from './schema/expenses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expenses.name, schema: expensesSchema }]),
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
