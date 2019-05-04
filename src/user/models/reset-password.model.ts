import { LoginVm } from './login.model';
import { IsNotEmpty } from 'class-validator';

export class ResetPasswordVm extends LoginVm {
  @IsNotEmpty()
  confirmPassword: string;
  @IsNotEmpty()
  code: string;
}
