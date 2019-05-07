import { IsNotEmpty, IsEmail } from 'class-validator';
import { LoginVm } from './login.model';

export class RegisterVm extends LoginVm {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
}
