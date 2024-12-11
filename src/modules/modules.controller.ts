import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { ModulesService } from './providers/modules.service';
import { CreateModuleDto } from './dtos/create-module.dto';
import { UpdateModuleDto } from './dtos/update-module.dto';
import { ResponseDto } from './../common/dtos/response';
import { Module } from './module.schema';

/**
 * Controller for handling API endpoints related to Modules.
 */
@ApiTags('Modules')
@ApiBearerAuth()
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  /**
   * Create a new module.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new module' })
  async create(
    @Body() createModuleDto: CreateModuleDto,
  ): Promise<ResponseDto<Module>> {
    return this.modulesService.create(createModuleDto);
  }

  /**
   * Get all modules.
   */
  @Get()
  @ApiOperation({ summary: 'Get all modules' })
  async findAll(): Promise<ResponseDto<Module[]>> {
    return this.modulesService.findAll();
  }

  /**
   * Get a module by ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a module by ID' })
  async findOne(@Param('id') id: string): Promise<ResponseDto<Module>> {
    return this.modulesService.findOne(id);
  }

  /**
   * Update a module by ID.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a module by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ): Promise<ResponseDto<Module>> {
    return this.modulesService.update(id, updateModuleDto);
  }

  /**
   * Delete a module by ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a module by ID' })
  async remove(@Param('id') id: string): Promise<ResponseDto<void>> {
    return this.modulesService.remove(id);
  }
}
