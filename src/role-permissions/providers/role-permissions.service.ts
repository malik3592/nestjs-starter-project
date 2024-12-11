import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { RolePermission } from '../role-permission.schema';
import { CreateRolePermissionDto } from '../dtos/create-role-permission.dto';
import { UpdateRolePermissionDto } from '../dtos/update-role-permission.dto';
import { ResponseDto } from '../../common/dtos/response';

/**
 * Service for handling business logic related to Role Permissions.
 */
@Injectable()
export class RolePermissionsService {
  constructor(
    @InjectModel(RolePermission.name)
    private readonly rolePermissionModel: Model<RolePermission>,
  ) {}

  /**
   * Assign permissions to a role.
   */
  async create(
    createRolePermissionDto: CreateRolePermissionDto,
  ): Promise<ResponseDto<RolePermission[]>> {
    try {
      const { roleId, permissions } = createRolePermissionDto;

      // Map the permissions array to create multiple entries
      const rolePermissions = permissions.map((permission) => ({
        roleId,
        moduleId: permission.moduleId,
        permissionId: permission.permissionId,
      }));

      const createdPermissions =
        await this.rolePermissionModel.insertMany(rolePermissions);

      return new ResponseDto<RolePermission[]>(
        'Permissions assigned to role successfully',
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Update permissions for a role.
   */
  async update(
    updateRolePermissionDto: UpdateRolePermissionDto,
  ): Promise<ResponseDto<RolePermission[]>> {
    try {
      const { permissions, roleId } = updateRolePermissionDto;

      // Fetch existing permissions for the role
      const existingPermissions = await this.rolePermissionModel
        .find({ roleId })
        .exec();

      // Create a map of existing permissions for quick lookup
      const existingPermissionsMap = new Map(
        existingPermissions.map((perm) => [
          `${perm.moduleId}-${perm.permissionId}`,
          perm._id.toString(),
        ]),
      );

      // Identify permissions to add and remove
      const newPermissions = [];
      const updatePermissionKeys = new Set();

      permissions.forEach((permission) => {
        const key = `${permission.moduleId}-${permission.permissionId}`;
        updatePermissionKeys.add(key);

        if (!existingPermissionsMap.has(key)) {
          // If the permission is not already in the database, add it to newPermissions
          newPermissions.push({
            roleId,
            moduleId: permission.moduleId,
            permissionId: permission.permissionId,
          });
        }
      });

      // Identify permissions to remove: those in the database but not in the updated permissions
      const permissionsToRemove = existingPermissions.filter(
        (perm) =>
          !updatePermissionKeys.has(`${perm.moduleId}-${perm.permissionId}`),
      );
      const permissionIdsToRemove = permissionsToRemove.map((perm) => perm._id);

      // Perform database operations
      if (permissionIdsToRemove.length) {
        await this.rolePermissionModel.deleteMany({
          _id: { $in: permissionIdsToRemove },
        });
      }
      if (newPermissions.length) {
        await this.rolePermissionModel.insertMany(newPermissions);
      }

      // Fetch the updated permissions list
      const updatedPermissions = await this.rolePermissionModel
        .find({ roleId })
        .exec();

      return new ResponseDto<RolePermission[]>(
        'Role permissions updated successfully',
        updatedPermissions,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get all role permissions.
   */
  async findAll(): Promise<ResponseDto<RolePermission[]>> {
    try {
      const rolePermissions = await this.rolePermissionModel.find().exec();
      return new ResponseDto<RolePermission[]>(
        'Role permissions retrieved successfully',
        rolePermissions,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get role permissions by role ID.
   */
  async findByRole(roleId: string): Promise<ResponseDto<RolePermission[]>> {
    try {
      const rolePermissions = await this.rolePermissionModel
        .find({ roleId })
        .exec();
      if (!rolePermissions.length) {
        throw new BadRequestException(
          `No permissions found for role ID ${roleId}.`,
        );
      }
      return new ResponseDto<RolePermission[]>(
        'Role permissions retrieved successfully',
        rolePermissions,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Delete role permissions by ID.
   */
  async remove(id: string): Promise<ResponseDto<void>> {
    try {
      const result = await this.rolePermissionModel
        .findByIdAndDelete(id)
        .exec();
      if (!result) {
        throw new BadRequestException(
          `Role permission with ID ${id} not found.`,
        );
      }
      return new ResponseDto<void>('Role permission deleted successfully');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Delete role permissions by ID.
   */
  async getRolePermissions(roleId: string): Promise<any> {
    try {
      const result = await this.rolePermissionModel.aggregate([
        {
          $match:
            /**
             * query: The query in MQL.
             */
            {
              roleId: new mongoose.Types.ObjectId(roleId),
            },
        },
        {
          $lookup: {
            from: 'permissions',
            localField: 'permissionId',
            foreignField: '_id',
            as: 'permission',
          },
        },
        {
          $lookup: {
            from: 'modules',
            localField: 'moduleId',
            foreignField: '_id',
            as: 'module',
          },
        },
        {
          $unwind: {
            path: '$module',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $unwind: {
            path: '$permission',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            'module.name': 1,
            'module.icon': 1,
            'module.path': 1,
            'permission.name': 1,
          },
        },
        {
          $group: {
            _id: '$module',
            permissions: {
              $push: '$permission.name',
            },
          },
        },
        {
          $project: {
            _id: 0,
            module: '$_id',
            permissions: 1,
          },
        },
      ]);
      if (!result) {
        throw new BadRequestException(`Role permission not found.`);
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
