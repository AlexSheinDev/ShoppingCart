import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true,
  });
};

const handleError = (errorResponse: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
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
  // Return LoginFail action
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  authSignup = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
          const signupUrl =
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
          return this.client
            .post<AuthResponseData>(signupUrl + environment.firebaseAPIKey, {
              email: signupAction.payload.email,
              password: signupAction.payload.password,
              returnSecureToken: true,
            })
            .pipe(
              tap((response) => {
                this.authService.setLogoutTimer(+response.expiresIn * 1000);
              }),
              map((response) => {
                return handleAuthentication(
                  +response.expiresIn,
                  response.email,
                  response.localId,
                  response.idToken
                );
              }),
              catchError((errorResponse) => {
                return handleError(errorResponse);
              })
            );
        })
      ),
    { dispatch: false }
  );

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
            tap((response) => {
              this.authService.setLogoutTimer(+response.expiresIn * 1000);
            }),
            map((response) => {
              return handleAuthentication(
                +response.expiresIn,
                response.email,
                response.localId,
                response.idToken
              );
            }),
            catchError((errorResponse) => {
              return handleError(errorResponse);
            })
          );
      })
    )
  );

  authAutoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          return { type: 'DUMMY' };
        }

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();

          this.authService.setLogoutTimer(expirationDuration);
          return new AuthActions.AuthenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false,
          });
          // const expirationDuration =
          //   new Date(userData._tokenExpirationDate).getTime() -
          //   new Date().getTime();
          // this.autoLogout(expirationDuration);
        }

        return { type: 'DUMMY' };
      })
    )
  );

  authLogout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );

  authRedirect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
          if (authSuccessAction.payload.redirect) {
            this.router.navigate(['/']);
          }
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private client: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
