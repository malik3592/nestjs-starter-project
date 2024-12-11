import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Module } from '../modules/module.schema';
import { Permission } from '../permissions/permission.schema';
import { Role } from '../roles/role.schema';

/**
 * RolePermissions Schema
 * Maps roles to their specific permissions for modules
 */
@Schema({ timestamps: true })
export class RolePermission extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Role.name,
    required: true,
  })
  roleId: Role;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Permission.name,
    required: true,
  })
  permissionId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Module.name,
    required: true,
  })
  moduleId: string;
}

export const RolePermissionSchema =
  SchemaFactory.createForClass(RolePermission);
