import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './providers/roles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './role.schema';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
})
export class RolesModule {}
