import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Modules Schema
 * Represents system modules with associated metadata
 */
@Schema({ timestamps: true })
export class Module extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  icon: string;

  @Prop()
  path: string;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
