import { IsNotEmpty } from 'class-validator';
import { User } from './user.model';

export class ChangePassword {
  user: User;
  @IsNotEmpty()
  newPassword: string;
  @IsNotEmpty()
  confirmPassword: string;
}
