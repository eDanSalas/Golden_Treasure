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
import {MatProgressBarModule} from '@angular/material/progress-bar';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { signal, computed } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';


@Component({
  selector: 'app-habitacion',
  imports: [RouterModule, MatProgressSpinnerModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatDatepickerModule, MatProgressBarModule, CommonModule, NgxPayPalModule],
  templateUrl: './habitacion.component.html',
  styleUrl: './habitacion.component.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class HabitacionComponent {
  habitacion!: Habitacion;
  id!: number;
  miform: FormGroup;
  progress: number = 0;

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
  validators: string[] =['nombre', 'email', 'telefono', 'reserva', 'rango'];
  precioTotal: number = 0;
  hoy = new Date();

  huespedes = signal<number>(1);
  noches = signal<number>(1);
  extrasSeleccionados = signal<Record<string, boolean>>({});
  reservaSeleccionada = signal<string>('');
  porHuesped: number = 50;
  porNoche = signal<number>(0);

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

  public payPalConfig?: IPayPalConfig;
  mostrarBotonesPayPal = false
  datosCredenciales: any = [];
  dataTotales: any = [];

  constructor(private servicio: HabitacionService, public route: ActivatedRoute, private fb:FormBuilder){
    const extrasControls: { [key: string]: FormControl } = {};
    this.extras.forEach(extra => {
      extrasControls[extra.sec] = new FormControl(false);
    });

    this.miform = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{3} \d{3} \d{4}$/)]],
      reserva: ['', Validators.required],
      extras: this.fb.group(extrasControls),
      rango: this.fb.group({                    //Validator Personalizado
        inicio: ['', Validators.required],
        fin: ['', Validators.required]
      }, {validators: this.validarCal})
    })

    this.miform.get('extras')?.valueChanges.subscribe(extras => {
      this.extrasSeleccionados.set(extras);
    });
  }

  async ngOnInit() {

    await this.obtenerDatosCredenciales();

    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.servicio.retornar().subscribe(data => {
      const hab = data.habitaciones.find(h => h.id === this.id);
      if (hab) {
        this.habitacion = hab;
        this.porNoche.set(hab.precio);
      }
    });

    this.miform.get('rango')?.valueChanges.subscribe(rango => {
      const inicio = new Date(rango.inicio);
      const fin = new Date(rango.fin);
      if (inicio && fin && !isNaN(inicio.getTime()) && !isNaN(fin.getTime())) {
        const diff = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
        this.noches.set(Math.max(Math.ceil(diff), 1));
      }
    });

    this.miform.get('reserva')?.valueChanges.subscribe(value => {
      this.reservaSeleccionada.set(value);
    });

    this.miform.valueChanges.subscribe(() => {
      this.progress = 0;
      this.validators.forEach(campo => {
        if (this.miform.get(campo)?.valid) {
          this.progress += 20;
        }
      });
    });

    window.scrollTo({ top: 0 });
  }

  private async obtenerDatosCredenciales() {
    const credenciales = await fetch('http://localhost:8080/api/cliente_paypal', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if(!credenciales) console.error("No se obtuvieron las credenciales");
    this.datosCredenciales = await credenciales.json();
  }

  private initConfig(): void {
    const clientId = this.datosCredenciales.credencialClient;
    // const precio = `${this.total()}.00`;
    const precio = `${this.dataTotales.total}.00`;
    console.log(clientId);
    console.log(this.habitacion.titulo);
    console.log(this.habitacion.descripcion);
    console.log(precio);
    
    this.payPalConfig = {
      currency: 'USD',
      clientId: clientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: precio,
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: precio
                }
              }
            },
            items: [
              {
                name: this.habitacion.titulo,
                quantity: '1',
                category: 'PHYSICAL_GOODS',
                unit_amount: {
                  currency_code: 'USD',
                  value: precio,
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  validarCal(control: AbstractControl): ValidationErrors | null {
    const inicio = new Date(control.get('inicio')?.value);
    const fin = new Date(control.get('fin')?.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const errors: ValidationErrors = {};
    if (inicio && inicio < hoy) {
      errors['fechaInicioPasada'] = true;
    }
    if (fin && fin < hoy) {
      errors['fechaFinPasada'] = true;
    }
    if (inicio && fin && fin <= inicio) {
      errors['fechaFinAnteriorInicio'] = true;
    }
    return Object.keys(errors).length ? errors : null;
  }

  total = computed(() => {                                                                //Señal de Angular tipo: Computed
    const base = this.huespedes() * this.porHuesped + this.noches() * this.porNoche();
    const tipoReserva = this.reservaSeleccionada();
    const costoReserva = this.reservaPrecios[tipoReserva] || 0;
    
    const extrasTotal = this.extras
      .filter(extra => this.extrasSeleccionados()[extra.sec])
      .reduce((sum, extra) => sum + extra.costo, 0);

    return base + extrasTotal + costoReserva;
  });

  aumentar(tipo: 'huespedes' | 'noches') {
    this[tipo].update(cant => cant + 1);
  }

  disminuir(tipo: 'huespedes' | 'noches') {
    if (this[tipo]() > 1) {
      this[tipo].update(cant => cant - 1);
    }
  }

  actualizarReserva() {
    const tipoReserva = this.miform.get('reserva')?.value;
    this.reservaSeleccionada.set(tipoReserva);
    console.log('Reserva seleccionada:', tipoReserva);
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
    if (this.miform.valid){
      const data = {
        habitacion: this.habitacion.titulo,
        nombre: this.miform.value.nombre,
        correo: this.miform.value.email,
        telefono: this.miform.value.telefono,
        huespedes: this.huespedes(),
        noches: this.noches(),
        reserva: this.miform.value.reserva,
        extras: Object.entries(this.miform.value.extras)
                  .filter(([key, value]) => value)
                  .map(([key]) => key),
        inicio: new Date(this.miform.value.rango.inicio).toISOString().slice(0, 10),
        fin: new Date(this.miform.value.rango.fin).toISOString().slice(0, 10),
        total: this.total()
      }

      fetch('http://localhost:8080/api/reservaciones/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(async response => {
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message);
        }
        return response.json();
      })
      .then(respuesta => {
        console.log('Reservación creada con número:', respuesta.no_reservacion);
        Swal.fire({
          icon: 'success',
          title: '¡Reservación Realizada!',
          text: `Su reservación fue creada con éxito. Número: ${respuesta.no_reservacion}`,
          confirmButtonText: 'Aceptar'
        });
        this.mostrarBotonesPayPal = true;
        this.initConfig();
      })
      .catch(error => {
        console.error('Error al enviar reservación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear la reservación',
          confirmButtonText: 'Aceptar'
        });
      });

      // this.huespedes.set(1);
      // this.noches.set(1);
      // this.extrasSeleccionados.set({});
      
      // this.miform.reset();
      // Swal.fire({
      //   icon: 'success',
      //   title: '¡Reservación Realizada!',
      //   text: 'Su reservación fue creada con éxito. ¡Nos vemos muy pronto!',
      //   confirmButtonText: 'Aceptar'
      // });
    } else {
      this.miform.markAllAsTouched();
    }
  }
}
