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

import { RolesService } from './providers/roles.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { ResponseDto } from './../common/dtos/response';
import { Role } from './role.schema';

/**
 * Controller for handling API endpoints related to Roles.
 */
@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Create a new role.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<ResponseDto<Role>> {
    return this.rolesService.create(createRoleDto);
  }

  /**
   * Get all roles.
   */
  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  async findAll(): Promise<ResponseDto<Role[]>> {
    return this.rolesService.findAll();
  }

  /**
   * Get a role by ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  async findOne(@Param('id') id: string): Promise<ResponseDto<Role>> {
    return this.rolesService.findOne(id);
  }

  /**
   * Update a role by ID.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a role by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<ResponseDto<Role>> {
    return this.rolesService.update(id, updateRoleDto);
  }

  /**
   * Delete a role by ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role by ID' })
  async remove(@Param('id') id: string): Promise<ResponseDto<void>> {
    return this.rolesService.remove(id);
  }
}
