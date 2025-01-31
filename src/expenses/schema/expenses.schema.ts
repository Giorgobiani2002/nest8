import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Expenses {
  @Prop({ required: true })
  category: string;
  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  quantity: number;
  @Prop({ required: true })
  price: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  user: mongoose.Schema.Types.ObjectId;
}

export const expensesSchema = SchemaFactory.createForClass(Expenses);
