import { Module, Global } from '@nestjs/common';
import { ConfigurationService } from './configuration/configuration.service';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  imports: [EmailModule, AuthModule],
  providers: [ConfigurationService],
  exports: [AuthModule, EmailModule, ConfigurationService],
})
export class SharedModule {}
