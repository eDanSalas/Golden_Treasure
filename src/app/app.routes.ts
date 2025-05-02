import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { AlojamientoComponent } from './components/alojamiento/alojamiento.component';
import { OfertasComponent } from './components/ofertas/ofertas.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';

export const routes: Routes = [
    {path: 'inicio', component: InicioComponent},
    {path: 'alojamiento', component: AlojamientoComponent},
    {path: 'ofertas', component: OfertasComponent},
    {path: 'servicios', component: ServiciosComponent},
    {path: 'comentarios', component: ComentariosComponent},
    {path: '', redirectTo: '/inicio', pathMatch: 'full'}
];
