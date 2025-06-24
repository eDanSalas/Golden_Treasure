import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder,FormGroup,Validators, AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showLogin=true;

  // Formularios
  loginForm: FormGroup;
  registerForm: FormGroup;

  //Variables para el captcha
  showCaptchaModal = false;
  captchaArray: string[] = [];
  captchaStyles: { [key: string]: string }[] = []; 
  userInput = '';
  captchaMode: 'login' | 'register' | null = null; 

  constructor(private fb: FormBuilder) {

    // Formulario de login
    this.loginForm=this.fb.group({
      id:['',[Validators.required]],
      contra:['',[Validators.required]]
    });

    // Formulario de registro
    this.registerForm=this.fb.group({
      correo:['',[Validators.required, Validators.email]],
      username:['',[Validators.required]],
      contra: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15), this.passwordPatternValidator]],
      confcontra: ['', [Validators.required]]
    }, { validators: this.matchPasswordValidator });
  }

  toggleMode() {
    this.showLogin=!this.showLogin;
  }

  async onLogin() {
  if (this.loginForm.valid) {
    const id = this.loginForm.get('id')?.value;
    const contra = this.loginForm.get('contra')?.value;

    const info = await fetch('http://localhost:8080/api/client/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, contra })
    });

    if (info.status === 501) {
      alert('Cuenta bloqueada, se te va a enviar un correo');
      const data = await fetch('http://localhost:8080/api/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      if (data.status === 200) {
        alert('Se envió un correo correctamente');
      }
      return;
    }

    if (info.status === 200) {
      const data = await info.json();
      // Aquí asumimos que el backend retorna algo como { id: ..., nombre: ... }
      localStorage.setItem('loggedUserId', data.id); 
      localStorage.setItem('loggedUserName', data.nombre);

      alert(`Bienvenido ${data.nombre}`);
      // Recarga para que el navbar detecte los cambios
      window.location.reload();
    } else {
      alert('Error en las credenciales');
    }
  }
}


  async onRegister(){
    if (this.registerForm.valid){
      const correo=this.registerForm.get('correo')?.value;
      const nombre=this.registerForm.get('username')?.value;
      const contra=this.registerForm.get('contra')?.value;
      // Aca pondremos la logica para mandar la informacion del registro

      const info = await fetch('http://localhost:8080/api/client', {
        method : 'POST', 
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, correo, contra })
      });
      
      const data = await info.json();

      data.message 
      
      if(info.ok){
        alert("Estas registrados");
      }

      console.log('Intentando registro con', { correo, nombre, contra });
    }
  }

  // Validators extra
  passwordPatternValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const valid = /^[A-Za-z0-9_]{6,15}$/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value);

    return valid ? null : { invalidPassword: true };
  }

  matchPasswordValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get('contra')?.value;
    const confirmPassword = formGroup.get('confcontra')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  };

   generateCaptcha() {
    this.userInput = '';
    this.captchaArray = [];
    this.captchaStyles = [];

    const longitud = 5;
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < longitud; i++) {
      const char = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
      this.captchaArray.push(char);
      this.captchaStyles.push(this.randomCharStyle());
    }
  }

  // Estilos para las letras y que se vea piola
  randomCharStyle(): { [key: string]: string } {
    const size = 16 + Math.floor(Math.random() * 12); // entre 16 y 28px
    const color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 40%)`;
    return {
      'font-size': `${size}px`,
      color
    };
  }

  openCaptchaModal(mode: 'login'|'register') {
    this.captchaMode = mode;
    this.showCaptchaModal = true;
    this.generateCaptcha();
  }

  verificarCaptcha() {
    const generated = this.captchaArray.join('');
    if (this.userInput === generated) {
      this.showCaptchaModal = false;
      // dependiendo de si es login o register hace la distincion
      if (this.captchaMode === 'login') this.onLogin();
      if (this.captchaMode === 'register') this.onRegister();
    } else {
      alert('Captcha incorrecto, inténtalo de nuevo');
      this.generateCaptcha();
    }
  }

}
