import { Injectable } from '@angular/core';
import { Desarrollador } from '../desarrollador';
import { DESARROLLADORES } from '../desarrolladores';

@Injectable({
  providedIn: 'root'
})
export class DesarrolladorService {

  private desarrolladores: Desarrollador[] = DESARROLLADORES;

  constructor() { }

  getDevs(): Desarrollador[] {
    return this.desarrolladores;
  }
}
