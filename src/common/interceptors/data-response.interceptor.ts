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
     * inject config
     */
    private readonly configService: ConfigService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const message = data.message;
        delete data?.message;
        return {
          apiVersion: this.configService.get('appConfig.apiVersion'),
          message,
          data: data.data,
        };
      }),
    );
  }
}
