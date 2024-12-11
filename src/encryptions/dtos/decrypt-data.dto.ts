import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DecryptDataDto {
  @ApiProperty({
    example:
      'KLdluRcLA535mUd4b483xL6NXS+KO12JDCevgZhdtbW5L91zvFAam6h7AjyE033dQHK71MFZUxX5wkpVpOcgtsld+H4pApx5W+XiZBZQu7Y=',
    description: 'The cipher text',
  })
  @IsString()
  @IsNotEmpty()
  cipher: string;
}
