import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const authService = inject(AuthService);
  
  const allowedRoles = route.data['roles'] as string[];
  
  const userRole = userService.getRol();

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  authService.redirectToHome();
  return false;
};