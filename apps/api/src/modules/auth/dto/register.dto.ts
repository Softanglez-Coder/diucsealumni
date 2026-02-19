import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Min 8 characters, must include uppercase, lowercase, number, and symbol.',
    example: 'P@ssw0rd!',
  })
  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number.' })
  @Matches(/[^A-Za-z0-9]/, { message: 'Password must contain at least one symbol.' })
  password!: string;

  @ApiProperty({ example: 'Fatima' })
  @IsString()
  @MinLength(1)
  firstName!: string;

  @ApiProperty({ example: 'Khanam' })
  @IsString()
  @MinLength(1)
  lastName!: string;
}
