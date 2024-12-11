import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    connectionString: process.env.CONNECTION_STRING,
  };
});
