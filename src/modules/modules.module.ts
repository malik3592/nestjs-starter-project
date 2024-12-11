import { Module } from '@nestjs/common';
import { ModulesController } from './modules.controller';
import { ModulesService } from './providers/modules.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Module as ProjectModule, ModuleSchema } from './module.schema';

@Module({
  controllers: [ModulesController],
  providers: [ModulesService],
  imports: [
    MongooseModule.forFeature([
      { name: ProjectModule.name, schema: ModuleSchema },
    ]),
  ],
})
export class ModulesModule {}
