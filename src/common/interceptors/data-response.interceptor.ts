import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(
    /**
     * Inject ConfigService
     */
    private readonly configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse();
        const statusCode = response.statusCode;

        const message = data.message;
        delete data?.message;

        return {
          statusCode,
          apiVersion: this.configService.get('appConfig.apiVersion'),
          message,
          data: data.data,
        };
      }),
    );
  }
}
