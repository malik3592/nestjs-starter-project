import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Roles Schema
 * Represents roles for access control
 */
@Schema({ timestamps: true })
export class Role extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
