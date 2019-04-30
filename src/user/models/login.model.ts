import { IsNotEmpty, IsEmail } from 'class-validator';
export class LoginVm {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
