import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthType } from './auth/enum/auth-type.enum';
import { AUTH_TYPE_KEY } from './auth/constants/auth.constants';
import { Auth } from './auth/decorator/auth.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiTags('Health Check')
  @Get()
  @Auth(AuthType.None)
  getHello(): string {
    return this.appService.getHello();
  }
}
