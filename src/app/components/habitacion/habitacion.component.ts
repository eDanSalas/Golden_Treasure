import { Component } from '@angular/core';
import { Habitacion } from '../../habitacion';
import { HabitacionService } from '../../services/habitacion.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-habitacion',
  imports: [RouterModule, MatProgressSpinnerModule, ReactiveFormsModule],
  templateUrl: './habitacion.component.html',
  styleUrl: './habitacion.component.css'
})
export class HabitacionComponent {
  habitacion!: Habitacion;
  id!: number;
  miform: FormGroup;

  habImage: {[key: number]: string[]} = {
    1: ["images/h1-1.jpg","images/h1-2.jpg","images/h1-3.jpg"],
    2: ["images/h2-1.jpg","images/h2-2.jpg","images/h2-3.jpg"],
    3: ["images/h3-1.jpg","images/h3-2.jpg","images/h3-3.jpg"],
    4: ["images/h4-1.jpg","images/h4-2.jpg","images/h4-3.jpg"],
    5: ["images/h5-1.jpg","images/h5-2.jpg","images/h5-3.jpg"],
    6: ["images/h6-1.jpg","images/h6-2.jpg","images/h6-3.jpg"],
    7: ["images/h7-1.jpg","images/h7-2.jpg","images/h7-3.jpg"],
    8: ["images/h8-1.jpg","images/h8-2.jpg","images/h8-3.jpg"],
    9: ["images/h9-1.webp","images/h9-2.webp","images/h9-3.webp"],
    10:["images/h10-1.webp","images/h10-2.webp","images/h10-3.webp"], 
  };
  amenidades: string[][] =[
    ["fa-wifi", "fa-lock", "fa-tv", "fa-snowflake", "fa-wine-glass", "fa-umbrella-beach", "fa-shower", "fa-building-shield", "fa-desktop", "fa-phone"],
    ["fa-lock", "fa-tv", "fa-snowflake", "fa-wifi", "fa-phone"],
    ["fa-lightbulb", "fa-wifi", "fa-building-shield", "fa-temperature-high"],
    ["fa-wifi", "fa-shower", "fa-desktop", "fa-snowflake", "fa-lock"],
    ["fa-wifi", "fa-lightbulb", "fa-wine-glass", "fa-phone"],
    ["fa-wifi", "fa-snowflake", "fa-tv", "fa-desktop", "fa-umbrella-beach"],
    ["fa-wifi", "fa-wine-glass", "fa-temperature-high", "fa-lightbulb"],
    ["fa-lock", "fa-tv", "fa-shower", "fa-lightbulb"],
    ["fa-wifi", "fa-building-shield", "fa-phone", "fa-snowflake"],
    ["fa-wifi", "fa-wine-glass", "fa-snowflake", "fa-umbrella-beach"]
  ];
  reservas: string[] = ['All-inclusive', 'Room Only', 'Bed and BreakFast', 'Full Board', 'Half Board'];

  constructor(private servicio: HabitacionService, public route: ActivatedRoute, private fb:FormBuilder){
    this.miform = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{3} \d{3} \d{4}$/)]],
      reserva: ['', Validators.required],
      extras: this.fb.group({
        Mascota: [false],
        Limpieza: [false],
        Toallas: [false]
      }),

    })
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.servicio.retornar().subscribe(data => {
      const hab = data.habitaciones.find(h => h.id === this.id);
      if (hab) {
        this.habitacion = hab;
      }
    });
  }

  obtenerAmenidad(icon: string): string {
    const nombres: { [key: string]: string } = {
      "fa-wifi": "WIFI",
      "fa-lock": "Caja Fuerte",
      "fa-tv": "Cable / Satélite",
      "fa-snowflake": "Aire Acondicionado",
      "fa-lightbulb": "Lámparas con USB",
      "fa-wine-glass": "Mini Bar",
      "fa-thermometer-half": "Aire Acondicionado",
      "fa-umbrella-beach": "Balcón o Terraza",
      "fa-shower": "Detector de Humo",
      "fa-building-shield": "Edificio 100% libre de Humo",
      "fa-desktop": "Pantalla HD 42\"",
      "fa-temperature-high": "Secadora",
      "fa-phone": "Teléfono"
    };
    return nombres[icon] || "Amenidad";
  }

  enviar(){
    if(this.miform.valid){
      Swal.fire({
        icon: 'success',
        title: '¡Cuenta creada!',
        text: 'Tu cuenta fue creada exitosamente.',
        confirmButtonText: 'Aceptar'
      });
      this.miform.reset();
    }else{
      const errores: string[] = [];
      const controles = this.miform.controls;
      if (controles['nombre']?.errors) 
        errores.push('- Nombre es obligatorio.');
      if (controles['email']?.errors) {
        if (controles['email'].errors['required']) 
          errores.push('- Email es obligatorio.');
        if (controles['email'].errors['email']) 
          errores.push('- Email no tiene formato válido.');
      }
      if (controles['telefono']?.errors) {
        if (controles['telefono'].errors['required']) 
          errores.push('- Teléfono es obligatorio.');
        if (controles['telefono'].errors['pattern']) 
          errores.push('- Teléfono debe tener el formato 123 456 7890.');
      }

      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        html: errores.join('<br>'),
        confirmButtonText: 'Revisar'
      });
      this.miform.markAllAsTouched();
    }
  }
}
