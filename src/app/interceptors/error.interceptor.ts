import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  // const userStore = inject(userStore);
  // const userStore = inject(UserStore);

  return next(req).pipe(
    catchError((error) => {
      const errorMessage = error.error;
      
      switch(error.status) {
        case 401:
          console.log("xxxxxxxxxxxx");
          if ((errorMessage !== "Invalid password" && errorMessage !== "Invalid username")) {
            snackBar.open("You are unauthorised to perform this action.", "", {
              panelClass: "b"
            });
          } 
          // else if (errorMessage === "Invalid password" || errorMessage === "Invalid username") {
          //   console.log("yyyyyyyy");
          //   userStore.setFailedAuth({ errorMessage: "Invalid username and/or password", isAuthenticated: false });
          // }
          break;
        case 403:
          snackBar.open("You are forbidden from performing this action.");
          break;
        case 500:
          snackBar.open("Something unexpected happened.");
          break;
        case 404:
          // snackBar.open("Resource cannot be found.");
          break;
        case 400:
          console.log(errorMessage);
          if (errorMessage !== "Username already exists") {
            snackBar.open("Bad request.", "", {
              panelClass: "error-snackbar"
            });
          } 
          break;
        default:
          console.log("Something unexpected happended.");
          console.log(errorMessage);
          break;
      }

      // if (error.status === 401 && (errorMessage !== "Invalid password" || 
      //   errorMessage !== "Invalid username")) {
      //   // console.log("401 - Unauthorised error");
      // }

      throw error;
    })
  );
};

// 401 + "invalid password"

// 401 + "invalid username"

// 401 + null (global handling)

// 403 (global handling)

// 500 (global handling)

// 404 (global handling)

// 400 + validation (subject for specific)