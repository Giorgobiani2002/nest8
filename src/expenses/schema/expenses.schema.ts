import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Expenses {
  @Prop({ required: true })
  category: string;
  @Prop({ unique: true, required: true })
  productName: string;

  @Prop({ required: true })
  quantity: number;
  @Prop({ required: true })
  price: number;
}

export const expensesSchema = SchemaFactory.createForClass(Expenses);
