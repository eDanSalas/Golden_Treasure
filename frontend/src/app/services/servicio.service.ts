import { Injectable } from '@angular/core';
import { Servicios } from '../components/servicios/servicios.interface';
import { SERVICIOS } from '../servicio';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private servicios: Servicios[] = SERVICIOS;

  constructor() { }

  getServicios(): Servicios[] {
    return this.servicios;
  }
}
