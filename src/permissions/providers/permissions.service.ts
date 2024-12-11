import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Permission } from '../permission.schema';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { UpdatePermissionDto } from '../dtos/update-permission.dto';
import { ResponseDto } from '../../common/dtos/response';

/**
 * Service for handling business logic related to Permissions.
 */
@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}

  /**
   * Create a new permission.
   */
  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<ResponseDto<Permission>> {
    try {
      const permission = new this.permissionModel(createPermissionDto);
      await permission.save();
      return new ResponseDto<Permission>(
        'Permission created successfully',
        permission,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Update an existing permission.
   */
  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<ResponseDto<Permission>> {
    try {
      const existingPermission = await this.permissionModel.findById(id).exec();
      if (!existingPermission) {
        throw new NotFoundException(`Permission with ID ${id} not found.`);
      }

      const updatedPermission = await this.permissionModel
        .findByIdAndUpdate(id, updatePermissionDto, { new: true })
        .exec();

      return new ResponseDto<Permission>(
        'Permission updated successfully',
        updatedPermission,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get all permissions.
   */
  async findAll(): Promise<ResponseDto<Permission[]>> {
    try {
      const permissions = await this.permissionModel.find().exec();
      return new ResponseDto<Permission[]>(
        'Permissions retrieved successfully',
        permissions,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get a permission by ID.
   */
  async findOne(id: string): Promise<ResponseDto<Permission>> {
    try {
      const permission = await this.permissionModel.findById(id).exec();
      if (!permission) {
        throw new NotFoundException(`Permission with ID ${id} not found.`);
      }
      return new ResponseDto<Permission>(
        'Permission retrieved successfully',
        permission,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Delete a permission by ID.
   */
  async remove(id: string): Promise<ResponseDto<void>> {
    try {
      const result = await this.permissionModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Permission with ID ${id} not found.`);
      }
      return new ResponseDto<void>('Permission deleted successfully');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
