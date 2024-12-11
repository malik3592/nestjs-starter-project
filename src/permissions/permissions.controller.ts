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

import { PermissionsService } from './providers/permissions.service';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { UpdatePermissionDto } from './dtos/update-permission.dto';
import { ResponseDto } from './../common/dtos/response';
import { Permission } from './permission.schema';

/**
 * Controller for handling API endpoints related to Permissions.
 */
@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  /**
   * Create a new permission.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new permission' })
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<ResponseDto<Permission>> {
    return this.permissionsService.create(createPermissionDto);
  }

  /**
   * Get all permissions.
   */
  @Get()
  @ApiOperation({ summary: 'Get all permissions' })
  async findAll(): Promise<ResponseDto<Permission[]>> {
    return this.permissionsService.findAll();
  }

  /**
   * Get a permission by ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a permission by ID' })
  async findOne(@Param('id') id: string): Promise<ResponseDto<Permission>> {
    return this.permissionsService.findOne(id);
  }

  /**
   * Update a permission by ID.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a permission by ID' })
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<ResponseDto<Permission>> {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  /**
   * Delete a permission by ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a permission by ID' })
  async remove(@Param('id') id: string): Promise<ResponseDto<void>> {
    return this.permissionsService.remove(id);
  }
}
