import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  authLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        const loginUrl =
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
        return this.client
          .post<AuthResponseData>(loginUrl + environment.firebaseAPIKey, {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          })
          .pipe(
            map((response) => {
              const expirationDate = new Date(
                new Date().getTime() + +response.expiresIn * 1000
              );
              return new AuthActions.Login({
                email: response.email,
                userId: response.localId,
                token: response.idToken,
                expirationDate: expirationDate,
              });
            }),
            catchError((errorResponse) => {
              let errorMessage = 'An unknown error occurred!';
              if (!errorResponse.error || !errorResponse.error.error) {
                return of(new AuthActions.LoginFail(errorMessage));
              }
              switch (errorResponse.error.error.message) {
                case 'EMAIL_EXISTS':
                  errorMessage = 'Such email already exists!';
                  break;
                case 'EMAIL_NOT_FOUND':
                  errorMessage = 'Such an email does not exist!';
                  break;
                case 'INVALID_PASSWORD':
                  errorMessage = 'Wrong password entered!';
                  break;
              }
              return of(new AuthActions.LoginFail(errorMessage)); // Return LoginFail action
            })
          );
      })
    )
  );

  authSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private client: HttpClient,
    private router: Router
  ) {}
}
