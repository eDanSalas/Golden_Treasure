import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServicioService } from '../../services/servicio.service';
import { Servicios } from './servicios.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-servicios',
  imports: [CommonModule, MatProgressSpinnerModule, RouterModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  losServicios: Servicios[] = [];

  constructor(public service: ServicioService) {

  }

  ngOnInit() {
    this.losServicios = this.service.getServicios();
    window.scrollTo({ top: 0 });
  }
}
