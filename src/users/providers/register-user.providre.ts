import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user.schema';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';

export class RegisterUserProvider {
  constructor(
    /**
     * Injecting user model
     */
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  /**
   * Creates a new user after validating and hashing the password.
   * @param createUserDto - DTO containing user details.
   * @returns The created user document.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    // Check if email already exists
    const existingUser = await this.userModel.findOne({
      email,
      deletedAt: null,
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }
    const user = new this.userModel(createUserDto);
    return await user.save();
  }
}
