import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiKey: string = 'AIzaSyDL0Qbdy1uNKGE5tWyKewQsZpWN9DyDyW4';

  constructor(private client: HttpClient) {}

  signUp(email: string, password: string) {
    return this.client.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
        this.apiKey,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );
  }
}
