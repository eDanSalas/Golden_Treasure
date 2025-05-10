import { Component } from '@angular/core';
import { Habitacion } from '../../habitacion';
import { HabitacionService } from '../../services/habitacion.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import {ChangeDetectionStrategy} from '@angular/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-habitacion',
  imports: [RouterModule, MatProgressSpinnerModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatDatepickerModule],
  templateUrl: './habitacion.component.html',
  styleUrl: './habitacion.component.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.Default
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
  huespedes: number = 1;
  noches: number = 1;
  porHuesped: number = 50;
  porNoche: number = 0;
  precioTotal: number = 0;
  hoy = new Date();

  extras = [
    {sec: 'Mascota', costo: 50, select: false},
    {sec: 'VinoHab', costo: 30, select: false},
    {sec: 'Toallas', costo: 5, select: false},
  ]

  reservaPrecios: { [key: string]: number } = {
    'All-inclusive': 100,
    'Room Only': 0,
    'Bed and BreakFast': 20,
    'Full Board': 60,
    'Half Board': 40
  };

  constructor(private servicio: HabitacionService, public route: ActivatedRoute, private fb:FormBuilder){
    const extrasControls: { [key: string]: FormControl } = {};
    this.extras.forEach(extra => {
      extrasControls[extra.sec] = new FormControl(false);
    });

    this.miform = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{3} \d{3} \d{4}$/)]],
      reserva: ['', Validators.required],
      extras: this.fb.group(extrasControls),
      rango: this.fb.group({
        inicio: ['', Validators.required],
        fin: ['', Validators.required]
      }, {validators: this.validarCal})
    })
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.servicio.retornar().subscribe(data => {
      const hab = data.habitaciones.find(h => h.id === this.id);
      if (hab) {
        this.habitacion = hab;
        this.porNoche = hab.precio;
      }
    });
  }

  validarCal(control: AbstractControl): ValidationErrors | null {
    const inicio = new Date(control.get('inicio')?.value);
    const fin = new Date(control.get('fin')?.value);
    const hoy = new Date();
    hoy.setHours(0,0,0,0); 
    if (inicio && inicio < hoy) {
      return { fechaInicioPasada: true };
    }
    if (fin && fin < hoy) {
      return { fechaFinPasada: true };
    }
    return null;
  }

  get total(): number {
    const base = this.huespedes * this.porHuesped + this.noches * this.porNoche;
    const tipoReserva = this.miform.get('reserva')?.value || '';
    const costoReserva = this.reservaPrecios[tipoReserva] || 0;
    const reservaTotal = this.noches * costoReserva;
    const extrasTotal = this.extras
      .filter(extra => this.miform.get(['extras', extra.sec])?.value)
      .reduce((sum, extra) => sum + extra.costo, 0);

    return this.precioTotal = base + extrasTotal + reservaTotal;
  }

  aumentar(tipo: 'huespedes' | 'noches') {
    this[tipo]++;
  }

  disminuir(tipo: 'huespedes' | 'noches') {
    if (this[tipo] > 1) {
      this[tipo]--;
    }
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
        title: '¡Reservacion Realizada!',
        text: 'Su reservación fue creada con exito. ¡Nos vemos muy Pronto!',
        confirmButtonText: 'Aceptar'
      });
    }else{
      const errores: string[] = [];
      const controles = this.miform.controls;
      const grupoFechas = controles['rango'] as FormGroup;
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
      if (grupoFechas?.errors?.['fechaInicioPasada']) {
        errores.push('- La fecha de inicio no puede ser anterior a hoy.');
      }

      Swal.fire({
        icon: 'error',
        title: 'Error en la Reservación.',
        html: errores.join('<br>'),
        confirmButtonText: 'Revisar'
      });
      this.miform.markAllAsTouched();
    }
  }
}
