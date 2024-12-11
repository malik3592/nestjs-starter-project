import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { loginDto } from '../dtos/signin.dto';
import { UsersService } from '../../users/providers/users.service';
import { HashingProvider } from './hashing.provider';

import { GenerateTokensProvider } from './generate-tokens.provider';
import { RolePermissionsService } from 'src/role-permissions/providers/role-permissions.service';
import { User } from 'src/users/user.schema';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly rolePermissionsService: RolePermissionsService,

    private readonly hashingProvider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}
  public async signIn(loginDto: loginDto) {
    let user: any = await this.usersService.findByEmail(loginDto.email);
    let isEqual: Boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        loginDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Password Comparison failed',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Password mismatch');
    }

    const permission = await this.rolePermissionsService.getRolePermissions(
      user.roleId,
    );

    const tokens = await this.generateTokensProvider.generateTokens(user);
    return {
      permission,
      ...tokens,
    };
  }
}
