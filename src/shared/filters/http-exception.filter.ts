import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    if (error.code === 11000) {
      return res.status(status).json({
        status,
        message: 'This username already registerd!',
        path: req.url,
      });
    }

    res.status(status).json({
      status,
      message: error.message,
      path: req.url,
    });
  }
}
