import { Component } from '@angular/core';
import { FormBuilder,FormGroup,Validators, AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showLogin=true;

  // Formularios
  loginForm: FormGroup;
  registerForm: FormGroup;

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

  async onLogin(){
    if (this.loginForm.valid){
      const id=this.loginForm.get('id')?.value;
      const contra=this.loginForm.get('contra')?.value;

      const info = await fetch('http://localhost:8080/api/client/login', {
        method : 'POST', 
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, contra })
      });

      if (info.status === 501) {
        alert('Cuenta bloqueada, se te va a envíar un correo');
        const data = await fetch('http://localhost:8080/api/mail', {
          method : 'POST', 
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        });
        if (data.status === 200) {
          alert('Se envio un correo correctamente');
        }
      }

      if (info.status === 200) {
        alert('Bienvenido');
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

}
