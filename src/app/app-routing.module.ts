import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { MatesComponent } from './modules/mates/mates.component';
import { StickersMemesComponent } from './modules/stickers-memes/stickers-memes.component';
import { TiktokComponent } from './modules/tiktok/tiktok.component';


const routes: Routes = [
  { path: '', component: InicioComponent }, // Página inicial
  {
    path: 'mates',
    component: MatesComponent
  },
  //{ path: 'mates', loadChildren: () => import('./mates/mates.module').then(m => m.MatesModule) },
  { path: 'stickers-memes', component: StickersMemesComponent },
  { path: 'tiktok', component: TiktokComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
