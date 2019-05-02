import { Module, Global } from '@nestjs/common';
import { ConfigurationService } from './configuration/configuration.service';
import { EmailModule } from './email/email.module';

@Global()
@Module({
  imports: [EmailModule],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class SharedModule {}
