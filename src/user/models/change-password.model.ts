import { LoginVm } from './login.model';
import { IsNotEmpty } from 'class-validator';

export class ChangePassowrdVm extends LoginVm {
  @IsNotEmpty()
  confirmPassword: string;
}
