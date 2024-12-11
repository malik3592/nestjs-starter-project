import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user.schema';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { PaginationQueryDto } from '../../common/pagination/dtos/pagination-query.dto';
import { error } from 'console';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { RegisterUserProvider } from './register-user.providre';
import { GenerateOtpDto } from '../../otp/dto/generate-otp.dto';
import { OTPType } from '../../otp/enums/otp-type.enum';
import { OTPService } from '../../otp/providers/otp.service';
import { VerifyOtpDto } from '../../auth/dtos/verify-otp.dto';
import { ValidateOtpDto } from '../../otp/dto/validate-otp.dto';

@Injectable()
export class UsersService {
  constructor(
    /**
     * Injecting mail service
     */
    private readonly mailerService: MailerService,

    /**
     * Injecting Find by email provider
     */
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
    /**
     * Injecting hashing providers
     */
    private readonly registerUserProvider: RegisterUserProvider,

    /**
     * Injecting otp service
     */
    private readonly otpService: OTPService,
    /**
     * Injecting user model
     */
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}
  /**
   * Create new user service
   * @param createUserDto
   * @returns
   */
  public async createUser(createUserDto: CreateUserDto) {
    return this.registerUserProvider.create(createUserDto);
  }

  /**
   * Get all user list service
   * @param paginationQueryDto
   * @returns
   */

  public async getAllUser(paginationQueryDto: PaginationQueryDto) {
    const skip = paginationQueryDto.page * (paginationQueryDto.page - 1);
    try {
      const usersList = await this.userModel
        .find({}, { password: 0, __v: 0 })
        .populate('role', { _id: 0, name: 1 })
        .skip(skip)
        .limit(paginationQueryDto.limit);
      return { message: 'All users', data: usersList };
    } catch (err) {
      throw new InternalServerErrorException(error['message']);
    }
  }

  /**
   * Update user service
   * @param updateUserDto
   * @returns
   */
  public async updateUser(updateUserDto: UpdateUserDto) {
    const updatedData: any = {};

    try {
      if (updateUserDto?.email) {
        const userAlreadyExist = await this.userModel.findOne({
          _id: { $ne: updateUserDto.id },
          email: updateUserDto.email,
        });
        if (userAlreadyExist) {
          throw new BadRequestException('Email already taken');
        }
      }
      for (var key in updateUserDto) {
        if (key !== 'id') updatedData[key] = updateUserDto[key];
      }
      const updatedUser = await this.userModel.updateOne(
        { _id: updateUserDto.id },
        updatedData,
        {},
      );
      if (updatedUser)
        return {
          message: 'User updated successfully',
        };
      else {
        throw new BadRequestException('User not found');
      }
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException(err['message']);
    }
  }

  /**
   * Get User by id
   *
   * @param id
   * @returns
   */
  public async getUserById(id: string) {
    try {
      const user = await this.userModel.findOne(
        {
          _id: id,
          isDeleted: false,
        },
        { password: 0, __v: 0 },
      );
      if (!user) {
        throw new BadRequestException('user not found');
      }
      return {
        message: `user retrieved successfully`,
        data: user,
      };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException(err['message']);
    }
  }

  /**
   * Update user status
   * @param id
   * @returns
   */
  public async updateUserStatus(id: string) {
    try {
      const user = await this.userModel.findOne({ _id: id });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      user.active = !user.active;
      await user.save();
      return {
        message: `User status change to ${user.active ? 'Active' : 'In-active'}`,
      };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException(err['message']);
    }
  }

  /**
   * Delete user
   * @param id
   * @returns
   */
  public async deleteUser(id: string) {
    try {
      const user = await this.userModel.findOne({
        _id: id,
        isDeleted: null,
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      user.deletedAt = new Date();
      await user.save();
      return {
        message: `User delete successfully`,
      };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException(err['message']);
    }
  }

  public async forgetPassword(phoneNumber: string) {
    try {
      const user = await this.userModel.findOne({
        phoneNumber,
        isDeleted: null,
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const generateOtpDto = new GenerateOtpDto();
      generateOtpDto.type = OTPType.PHONE;
      generateOtpDto.userId = user._id.toString();

      return await this.otpService.generateOtp(generateOtpDto);
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException(err['message']);
    }
  }

  public async verifyOTP(verifyOtpDto: VerifyOtpDto) {
    try {
      const user = await this.userModel.findOne({
        phoneNumber: verifyOtpDto.phoneNumber,
        deletedAt: null,
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const validateOtp = new ValidateOtpDto();
      validateOtp.type = OTPType.PHONE;
      validateOtp.userId = user._id.toString();
      validateOtp.otp = verifyOtpDto.otp;

      return await this.otpService.validateOtp(validateOtp);
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException(err['message']);
    }
  }

  public async findOneById(id: any) {}
  public findByEmail(email: string) {
    return this.findOneUserByEmailProvider.findByEmail(email);
  }

  public async updatePassword(phoneNumber: string, password: string) {
    try {
      const user = await this.userModel.findOne({
        phoneNumber,
        deletedAt: null,
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      user.password = password;
      return await user.save();
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException(err['message']);
    }
  }
}
