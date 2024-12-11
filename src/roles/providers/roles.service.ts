import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Role } from '../role.schema';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { ResponseDto } from '../../common/dtos/response';

/**
 * Service for handling business logic related to Roles.
 */
@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
  ) {}

  /**
   * Create a new role.
   */
  async create(createRoleDto: CreateRoleDto): Promise<ResponseDto<Role>> {
    try {
      const role = new this.roleModel(createRoleDto);
      await role.save();
      return new ResponseDto<Role>('Role created successfully', role);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Update an existing role.
   */
  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<ResponseDto<Role>> {
    try {
      const existingRole = await this.roleModel.findById(id).exec();
      if (!existingRole) {
        throw new NotFoundException(`Role with ID ${id} not found.`);
      }

      const updatedRole = await this.roleModel
        .findByIdAndUpdate(id, updateRoleDto, { new: true })
        .exec();

      return new ResponseDto<Role>('Role updated successfully', updatedRole);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get all roles.
   */
  async findAll(): Promise<ResponseDto<Role[]>> {
    try {
      const roles = await this.roleModel.find().exec();
      return new ResponseDto<Role[]>('Roles retrieved successfully', roles);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get a role by ID.
   */
  async findOne(id: string): Promise<ResponseDto<Role>> {
    try {
      const role = await this.roleModel.findById(id).exec();
      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found.`);
      }
      return new ResponseDto<Role>('Role retrieved successfully', role);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Delete a role by ID.
   */
  async remove(id: string): Promise<ResponseDto<void>> {
    try {
      const result = await this.roleModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Role with ID ${id} not found.`);
      }
      return new ResponseDto<void>('Role deleted successfully');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
