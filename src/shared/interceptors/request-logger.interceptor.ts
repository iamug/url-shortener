import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const path = context.getArgs()[0]?.url;
    const method = context.getArgs()[0]?.method;
    const controller = context.getClass().name;
    const handler = context.getHandler().name;
    return next.handle().pipe(
      tap(() =>
        console.info(
          `Success => [${method} -- ${path}] => [${controller} => ${handler}] -- After... ${
            Date.now() - now
          }ms`,
        ),
      ),
      catchError((error) => {
        console.error(
          `Error => [${controller} => ${handler}] ,  ${
            error.message
          } -- After... ${Date.now() - now}ms`,
        );
        return throwError(() => error);
      }),
    );
  }
}
