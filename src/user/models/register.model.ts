import { IsNotEmpty, IsNumber } from 'class-validator';
import { LoginVm } from './login.model';

export class RegisterVm extends LoginVm {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsNumber()
  age: number;
}
