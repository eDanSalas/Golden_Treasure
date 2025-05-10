import { Component } from '@angular/core';
import { Servicios } from '../servicios/servicios.interface';
import { ServicioService } from '../../services/servicio.service';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-servicio',
  imports: [RouterModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './servicio.component.html',
  styleUrl: './servicio.component.css'
})
export class ServicioComponent {
  servicio!: Servicios;
  id!: number;

  serImage: {[key: number]: string[]} = {
    1: ["images/s1-1.jpg","images/s1-2.jpg","images/s1-3.jpg"],
    2: ["images/s2-1.jpg","images/s2-2.jpg","images/s2-3.jpg"],
    3: ["images/s3-1.jpg","images/s3-2.jpg","images/s3-3.jpg"],
    4: ["images/s4-1.jpg","images/s4-2.jpg","images/s4-3.jpg"],
    5: ["images/s5-1.jpg","images/s5-2.jpg","images/s5-3.jpg"],
    6: ["images/s6-1.jpg","images/s6-2.jpg","images/s6-3.jpg"],
    7: ["images/s7-1.jpg","images/s7-2.jpg","images/s7-3.jpg"],
    8: ["images/s8-1.jpg","images/s8-2.jpg","images/s8-3.jpg"],
    9: ["images/s9-1.jpg","images/s9-2.jpg","images/s9-3.jpg"],
  };

  constructor(public service: ServicioService, public route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    const sEncontrado = this.service.getServicios().find(s => s.id == this.id);
    if (sEncontrado) {
      this.servicio = sEncontrado;
    }
  }

  pedirInformacion() {
    alert('Gracias por su interés. Nos pondremos en contacto con usted para brindarle más información sobre este servicio.');
  }


}
