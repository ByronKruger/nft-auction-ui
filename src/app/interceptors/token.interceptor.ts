import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user/user.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  if (userService.user()){
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${userService.user()!.token}`
      }
    });
  }
  return next(req);
};
