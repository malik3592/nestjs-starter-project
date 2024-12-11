import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user.schema';
import { Model } from 'mongoose';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    /**
     * inject user repo
     */
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  public async findByEmail(email: string): Promise<User | null | undefined> {
    let user: User | undefined = undefined;
    try {
      user = await this.userModel.findOne({ email });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the user',
      });
    }
    //throw an exception user not found
    if (!user) {
      throw new UnauthorizedException('User not exist');
    }
    return user;
  }
}
