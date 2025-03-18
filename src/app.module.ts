import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DataResponseInterceptor } from './common/interceptors/data-response.interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import mailConfig from './config/mail.config';
import environmentValidation from './config/environment.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PaginationModule } from './common/pagination/pagination.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SocketModule } from './socket/socket.module';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { JwtModule } from '@nestjs/jwt';
import { OtpModule } from './otp/otp.module';
import jwtConfig from './auth/config/jwt.config';
import { RolesGuard } from './auth/guards/roles/roles.guard';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ModulesModule } from './modules/modules.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { EncryptionInterceptor } from './common/interceptors/encryption.interceptor';
import { EncryptionsModule } from './encryptions/encryptions.module';
import { PaginationWithAggregationProvider } from './common/pagination/providors/pagination-with-aggregation.provider';
import { PaginationProvider } from './common/pagination/providors/pagination.provide';
import { MongoExceptionInterceptor } from './common/interceptors/mongo-exception.interceptor';
import { TestModule } from './test/test.module';
const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    /**
     * Static files
     */
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public'), // Serve static files from the "public" folder
    }),
    /**
     * Environment Config
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig, mailConfig],
      validationSchema: environmentValidation,
    }),
    /**
    /**
     * Mongodb config
     */
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.connectionString'),
      }),
    }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    /**
     * Nodemailer config
     */
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('mail.mailHost'),
          port: configService.get<number>('mail.mailPort'),
          secure: true, // Use TLS/SSL for port 465
          auth: {
            user: configService.get<string>('mail.mailAddress'),
            pass: configService.get<string>('mail.mailPassword'),
          },
        },
        defaults: {
          from: `"RMG Construction" <${configService.get<string>('mail.mailAddress')}>`,
        },
      }),
    }),
    /**
     * Pagination module
     */
    PaginationModule,
    UsersModule,
    SocketModule,
    OtpModule,
    RolesModule,
    PermissionsModule,
    ModulesModule,
    RolePermissionsModule,
    EncryptionsModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_INTERCEPTOR,
      useFactory: (configService: ConfigService) => {
        const isEncryptionActive =
          configService.get<string>('ENCRYPTION_ACTIVE') === 'true';
        return new EncryptionInterceptor(isEncryptionActive, [
          '/encryptions/encrypt',
          '/encryptions/decrypt',
        ]);
      },
      inject: [ConfigService],
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MongoExceptionInterceptor,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

    AccessTokenGuard,
    PaginationWithAggregationProvider,
    PaginationProvider,
  ],
})
export class AppModule {}
