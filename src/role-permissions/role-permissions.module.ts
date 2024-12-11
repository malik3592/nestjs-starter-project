import { Module } from '@nestjs/common';
import { RolePermissionsController } from './role-permissions.controller';
import { RolePermissionsService } from './providers/role-permissions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RolePermission, RolePermissionSchema } from './role-permission.schema';

@Module({
  controllers: [RolePermissionsController],
  providers: [RolePermissionsService],
  imports: [
    MongooseModule.forFeature([
      { name: RolePermission.name, schema: RolePermissionSchema },
    ]),
  ],
  exports: [RolePermissionsService],
})
export class RolePermissionsModule {}
