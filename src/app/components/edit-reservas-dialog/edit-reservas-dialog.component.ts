import { Component, Inject, OnInit } from '@angular/core';
import { Habitacion } from '../../habitacion';
import { HabitacionService } from '../../services/habitacion.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import {ChangeDetectionStrategy} from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import {DateAdapter, MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-edit-reservas-dialog',
  imports: [RouterModule, MatProgressSpinnerModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, 
    MatDatepickerModule, MatProgressBarModule, CommonModule, MatDialogActions, MatDialogContent, 
    MatInputModule, MatLabel, MatFormField, MatDialogContent, FormsModule, MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule],
  templateUrl: './edit-reservas-dialog.component.html',
  styleUrl: './edit-reservas-dialog.component.css'
})

export class EditReservasDialogComponent implements OnInit {
  form: FormGroup;
  reservaPrecios: { [key: string]: number } = {
    'All-inclusive': 100,
    'Room Only': 0,
    'Bed and BreakFast': 20,
    'Full Board': 60,
    'Half Board': 40
  };
  extrasDisponibles = [
    { sec: 'Mascota', costo: 50 },
    { sec: 'VinoHab', costo: 30 },
    { sec: 'Toallas', costo: 5 },
  ];

  total: number = 0;

  constructor(
    public dialogRef: MatDialogRef<EditReservasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: [data.nombre, [Validators.required]],
      correo: [data.correo, [Validators.required, Validators.email]],
      telefono: [data.telefono, [Validators.required]],
      habitacion: [data.habitacion, Validators.required],
      huespedes: [data.huespedes, [Validators.required, Validators.min(1)]],
      noches: [data.noches, [Validators.required, Validators.min(1)]],
      reserva: [data.reserva, Validators.required],
      inicio: [new Date(this.data.inicio), Validators.required],
      fin: [new Date(this.data.fin), Validators.required],
      extras: this.fb.group(
        this.extrasDisponibles.reduce((acc, extra) => {
          acc[extra.sec] = [data.extras.includes(extra.sec)];
          return acc;
        }, {} as any)
      )
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => this.calcularTotal());
    this.calcularTotal();
  }

  calcularTotal() {
    const v = this.form.value;
    const base = v.huespedes * 50 + v.noches * this.precioHabitacion(this.data.hab);
    const reservaExtra = (this.reservaPrecios[v.tipoReserva] || 0) * v.noches;
    const extrasTotal = this.extrasDisponibles.reduce((sum, e) => {
      return sum + (this.form.get('extras')?.get(e.sec)?.value ? e.costo : 0);
    }, 0);
    this.total = base + reservaExtra + extrasTotal;
  }

  precioHabitacion(titulo: string): number {
    const precios: Record<string, number> = {
      'Suite Presidencial': 500, 
      'Suite Deluxe': 300,
      'Doble Estándar': 120,
      'Familiar Premium': 200,
      'Habitación Individual': 80,
      'Doble con Balcón': 130,
      'Junior Suite': 220,
      'Triple Económica': 100,
      'Suite Romántica': 170,
      'Familiar Estándar': 160
    };
    return precios[titulo] || 80;
  }


  guardar() {
    if (this.form.valid) {
      const reservacionEditada = {
        ...this.form.value,
        extras: Object.entries(this.form.value.extras)
                     .filter(([_, v]) => v)
                     .map(([k]) => k),
        total: this.total
      };
      this.dialogRef.close(reservacionEditada);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}
// export class EditReservasDialogComponent {
//   habitacion!: Habitacion;
//   id!: number;
//   miform: FormGroup;

//   onCancel(): void {
//     this.dialogRef.close();
//   }

//   onSave(): void {
//     this.dialogRef.close(this.servicio);
//   }

//   reservas: string[] = ['All-inclusive', 'Room Only', 'Bed and BreakFast', 'Full Board', 'Half Board'];
//   validators: string[] =['nombre', 'email', 'telefono', 'reserva', 'rango'];
//   huespedes: number = 1;
//   noches: number = 1;
//   porHuesped: number = 50;
//   porNoche: number = 0;
//   precioTotal: number = 0;
//   hoy = new Date();

//   extras = [
//     {sec: 'Mascota', costo: 50, select: false},
//     {sec: 'VinoHab', costo: 30, select: false},
//     {sec: 'Toallas', costo: 5, select: false},
//   ]

//   reservaPrecios: { [key: string]: number } = {
//     'All-inclusive': 100,
//     'Room Only': 0,
//     'Bed and BreakFast': 20,
//     'Full Board': 60,
//     'Half Board': 40
//   };

//   reservacion: any;

//   constructor(private servicio: HabitacionService, public route: ActivatedRoute, private fb:FormBuilder,
//     public dialogRef: MatDialogRef<EditReservasDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any
//   ){

//     this.reservacion = { ...data.reservacion}; // Copia del servicio original

//     const extrasControls: { [key: string]: FormControl } = {};
//     this.extras.forEach(extra => {
//       extrasControls[extra.sec] = new FormControl(false);
//     });

//     this.miform = this.fb.group({
//       nombre: ['', [Validators.required, Validators.minLength(4)]],
//       email: ['', [Validators.required, Validators.email]],
//       telefono: ['', [Validators.required, Validators.pattern(/^\d{3} \d{3} \d{4}$/)]],
//       reserva: ['', Validators.required],
//       extras: this.fb.group(extrasControls),
//       rango: this.fb.group({
//         inicio: ['', Validators.required],
//         fin: ['', Validators.required]
//       }, {validators: this.validarCal})
//     })
//   }

//   ngOnInit(): void {
//     this.id = +this.route.snapshot.paramMap.get('id')!;
//     this.servicio.retornar().subscribe(data => {
//       const hab = data.habitaciones.find(h => h.id === this.id);
//       if (hab) {
//         this.habitacion = hab;
//         this.porNoche = hab.precio;
//       }
//     });

//     this.miform.get('rango')?.valueChanges.subscribe(rango => {
//       const inicio = new Date(rango.inicio);
//       const fin = new Date(rango.fin);
//       if (inicio && fin && !isNaN(inicio.getTime()) && !isNaN(fin.getTime())) {
//         const diff = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
//         this.noches = Math.max(Math.ceil(diff), 1);
//       }
//     });

//     window.scrollTo({ top: 0 });
//   }

//   validarCal(control: AbstractControl): ValidationErrors | null {
//     const inicio = new Date(control.get('inicio')?.value);
//     const fin = new Date(control.get('fin')?.value);
//     const hoy = new Date();
//     hoy.setHours(0,0,0,0); 
//     if (inicio && inicio < hoy) {
//       return { fechaInicioPasada: true };
//     }
//     if (fin && fin < hoy) {
//       return { fechaFinPasada: true };
//     }
//     return null;
//   }

//   get total(): number {
//     const base = this.huespedes * this.porHuesped + this.noches * this.porNoche;
//     const tipoReserva = this.miform.get('reserva')?.value || '';
//     const costoReserva = this.reservaPrecios[tipoReserva] || 0;
//     const reservaTotal = this.noches * costoReserva;
//     const extrasTotal = this.extras
//       .filter(extra => this.miform.get(['extras', extra.sec])?.value)
//       .reduce((sum, extra) => sum + extra.costo, 0);

//     return this.precioTotal = base + extrasTotal + reservaTotal;
//   }

//   aumentar(tipo: 'huespedes' | 'noches') {
//     this[tipo]++;
//   }

//   disminuir(tipo: 'huespedes' | 'noches') {
//     if (this[tipo] > 1) {
//       this[tipo]--;
//     }
//   }

//   obtenerAmenidad(icon: string): string {
//     const nombres: { [key: string]: string } = {
//       "fa-wifi": "WIFI",
//       "fa-lock": "Caja Fuerte",
//       "fa-tv": "Cable / Satélite",
//       "fa-snowflake": "Aire Acondicionado",
//       "fa-lightbulb": "Lámparas con USB",
//       "fa-wine-glass": "Mini Bar",
//       "fa-thermometer-half": "Aire Acondicionado",
//       "fa-umbrella-beach": "Balcón o Terraza",
//       "fa-shower": "Detector de Humo",
//       "fa-building-shield": "Edificio 100% libre de Humo",
//       "fa-desktop": "Pantalla HD 42\"",
//       "fa-temperature-high": "Secadora",
//       "fa-phone": "Teléfono"
//     };
//     return nombres[icon] || "Amenidad";
//   }

//   enviar(){
//     if (this.miform.valid){
//       const data = {
//         hab: this.habitacion.titulo,
//         nombre: this.miform.value.nombre,
//         email: this.miform.value.email,
//         telefono: this.miform.value.telefono,
//         huespedes: this.huespedes,
//         noches: this.noches,
//         tipoReserva: this.miform.value.reserva,
//         extras: Object.entries(this.miform.value.extras)
//                   .filter(([key, value]) => value)
//                   .map(([key]) => key),
//         fechaInicio: this.miform.value.rango.inicio,
//         fechaFin: this.miform.value.rango.fin,
//         total: this.total
//       }
//       const lsData = JSON.parse(localStorage.getItem('reservaciones') || '[]');
//       lsData.push(data);
//       localStorage.setItem('reservaciones',JSON.stringify(lsData));
      
//       this.miform.reset();
//       Swal.fire({
//         icon: 'success',
//         title: '¡Reservación Realizada!',
//         text: 'Su reservación fue creada con éxito. ¡Nos vemos muy pronto!',
//         confirmButtonText: 'Aceptar'
//       });
//     } else {
//       this.miform.markAllAsTouched();
//     }
//   }
// }
