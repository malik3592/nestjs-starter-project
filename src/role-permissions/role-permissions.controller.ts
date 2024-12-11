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

import { RolePermissionsService } from './providers/role-permissions.service';
import { CreateRolePermissionDto } from './dtos/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dtos/update-role-permission.dto';
import { ResponseDto } from './../common/dtos/response';
import { RolePermission } from './role-permission.schema';

/**
 * Controller for handling API endpoints related to Role Permissions.
 */
@ApiTags('Role Permissions')
@ApiBearerAuth()
@Controller('role-permissions')
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  /**
   * Assign permissions to a role.
   */
  @Post()
  @ApiOperation({ summary: 'Assign permissions to a role' })
  async create(
    @Body() createRolePermissionDto: CreateRolePermissionDto,
  ): Promise<ResponseDto<RolePermission[]>> {
    return this.rolePermissionsService.create(createRolePermissionDto);
  }

  /**
   * Get all role permissions.
   */
  @Get()
  @ApiOperation({ summary: 'Get all role permissions' })
  async findAll(): Promise<ResponseDto<RolePermission[]>> {
    return this.rolePermissionsService.findAll();
  }

  /**
   * Get role permissions by role ID.
   */
  @Get(':roleId')
  @ApiOperation({ summary: 'Get role permissions by role ID' })
  async findByRole(
    @Param('roleId') roleId: string,
  ): Promise<ResponseDto<RolePermission[]>> {
    return this.rolePermissionsService.findByRole(roleId);
  }

  /**
   * Update role permissions by ID.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update role permissions by ID' })
  async update(
    @Body() updateRolePermissionDto: UpdateRolePermissionDto,
  ): Promise<ResponseDto<RolePermission[]>> {
    return this.rolePermissionsService.update(updateRolePermissionDto);
  }

  /**
   * Delete role permissions by ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete role permissions by ID' })
  async remove(@Param('id') id: string): Promise<ResponseDto<void>> {
    return this.rolePermissionsService.remove(id);
  }
}
