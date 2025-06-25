import { Injectable } from '@angular/core';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getAuth(){
    return getAuth();
  }

  async logInGoogle(){
    try {
      const userCredential = await signInWithPopup(getAuth(), new GoogleAuthProvider());
      const user = userCredential.user;
      return user;
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      throw error;
    }
  }

  logLogout(){
    return signOut(getAuth());
  }

}
