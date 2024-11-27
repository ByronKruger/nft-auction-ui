import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);

  if (userService.roles().includes("ADMIN"))
    return true;
  return false;
};
