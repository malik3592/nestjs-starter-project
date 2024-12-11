import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  mailAddress: process.env.MAIL_ADDRESS,
  mailPort: process.env.MAIL_PORT,
  mailPassword: process.env.MAIL_PASSWORD,
  mailHost: process.env.MAIL_HOST,
}));
