import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { RegisterUserProvider } from './providers/register-user.providre';
import { OtpModule } from '../otp/otp.module';

@Module({
  providers: [UsersService, FindOneUserByEmailProvider, RegisterUserProvider],
  controllers: [UsersController],
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    OtpModule,
  ],
  exports: [UsersService, RegisterUserProvider],
})
export class UsersModule {}
