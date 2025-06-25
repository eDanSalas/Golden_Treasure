import { Injectable } from '@angular/core';
import { getAuth, GoogleAuthProvider, PhoneAuthProvider, RecaptchaVerifier, signInWithCredential, signInWithPhoneNumber, signInWithPopup, signOut } from 'firebase/auth';
import Swal from 'sweetalert2';

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

  logInMessage(phoneNumber: any){
    const reCaptchaVerifier = new RecaptchaVerifier(getAuth(), 'sign-in-button', { size: 'invisible' });
    signInWithPhoneNumber(getAuth(), phoneNumber, reCaptchaVerifier)
      .then((confirmationResult) => {
        localStorage.setItem('verificationId', JSON.stringify(confirmationResult.verificationId));
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: 'Error',
          text: error,
          timer: 3000
        })
      });
  }

  credential(verify: any, otp: string){
    const credential = PhoneAuthProvider.credential(verify, otp);
    signInWithCredential(getAuth(), credential)
      .then((response) => {
        localStorage.setItem('user_data', JSON.stringify(response));
      }).catch((error) => {
        Swal.fire({
          title: 'Error',
          text: error,
          timer: 3000
        })
      })
  }

  logLogout(){
    return signOut(getAuth());
  }

}
