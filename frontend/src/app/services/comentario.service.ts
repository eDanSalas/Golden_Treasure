import { Injectable } from '@angular/core';
import { Comentario } from '../comentario';
import { COMENTARIOS } from '../comentarios';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private comentarios: Comentario[] = COMENTARIOS;

  constructor() { }

  getComments(): Comentario[] {
    return this.comentarios;
  }
  
}
