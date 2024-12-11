import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Module } from '../module.schema';
import { CreateModuleDto } from '../dtos/create-module.dto';
import { UpdateModuleDto } from '../dtos/update-module.dto';
import { ResponseDto } from '../../common/dtos/response';

/**
 * Service for handling business logic related to Modules.
 */
@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name)
    private readonly moduleModel: Model<Module>,
  ) {}

  /**
   * Create a new module.
   */
  async create(createModuleDto: CreateModuleDto): Promise<ResponseDto<Module>> {
    try {
      const module = new this.moduleModel(createModuleDto);
      await module.save();
      return new ResponseDto<Module>('Module created successfully', module);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Update an existing module.
   */
  async update(
    id: string,
    updateModuleDto: UpdateModuleDto,
  ): Promise<ResponseDto<Module>> {
    try {
      const existingModule = await this.moduleModel.findById(id).exec();
      if (!existingModule) {
        throw new NotFoundException(`Module with ID ${id} not found.`);
      }

      const updatedModule = await this.moduleModel
        .findByIdAndUpdate(id, updateModuleDto, { new: true })
        .exec();

      return new ResponseDto<Module>(
        'Module updated successfully',
        updatedModule,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get all modules.
   */
  async findAll(): Promise<ResponseDto<Module[]>> {
    try {
      const modules = await this.moduleModel.find().exec();
      return new ResponseDto<Module[]>(
        'Modules retrieved successfully',
        modules,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get a module by ID.
   */
  async findOne(id: string): Promise<ResponseDto<Module>> {
    try {
      const module = await this.moduleModel.findById(id).exec();
      if (!module) {
        throw new NotFoundException(`Module with ID ${id} not found.`);
      }
      return new ResponseDto<Module>('Module retrieved successfully', module);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Delete a module by ID.
   */
  async remove(id: string): Promise<ResponseDto<void>> {
    try {
      const result = await this.moduleModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Module with ID ${id} not found.`);
      }
      return new ResponseDto<void>('Module deleted successfully');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
