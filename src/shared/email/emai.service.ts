import { Injectable, InternalServerErrorException } from '@nestjs/common';

import * as sgMail from '@sendgrid/mail';
import { Configuration } from '../configuration/configuration.enum';
import { get } from 'config';
import EmailTemplate from './email-template.interface';

@Injectable()
export class EmailService {
  async sendMail(msg: EmailTemplate): Promise<void> {
    try {
      sgMail.setApiKey(
        process.env[Configuration.SENDGRID] || get(Configuration.SENDGRID),
      );
      await sgMail.send(msg);
    } catch (err) {
      throw new InternalServerErrorException(err.message, err.toString());
    }
  }
}
