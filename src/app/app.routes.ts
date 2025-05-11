import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { AlojamientoComponent } from './components/alojamiento/alojamiento.component';
import { OfertasComponent } from './components/ofertas/ofertas.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { ServicioComponent } from './components/servicio/servicio.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { HabitacionComponent } from './components/habitacion/habitacion.component';
import { DesarrolladoresComponent } from './components/desarrolladores/desarrolladores.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    {path: 'inicio', component: InicioComponent},
    {path: 'alojamiento', component: AlojamientoComponent},
    {path: 'habitacion/:id', component: HabitacionComponent},
    {path: 'ofertas', component: OfertasComponent},
    {path: 'servicios', component: ServiciosComponent},
    {path: 'servicio/:id', component: ServicioComponent},
    {path: 'comentarios', component: ComentariosComponent},
    {path: 'desarrolladores', component: DesarrolladoresComponent},
    {path: 'dashboard/:id', component: DashboardComponent },
    {path: '', redirectTo: '/inicio', pathMatch: 'full'}
];
