import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './core/material/material.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InicioComponent } from './inicio/inicio.component';

import { YouTubePlayerModule } from '@angular/youtube-player';
import { StickersMemesComponent } from './modules/stickers-memes/stickers-memes.component';
import { MatesComponent } from './modules/mates/mates.component';

import { PrincipalComponent } from './shared/components/principal/principal.component';
import { GrupoComponent } from './shared/components/grupo/grupo.component';
import { ItemComponent } from './shared/components/item/item.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { TiktokComponent } from './modules/tiktok/tiktok.component';
import { HttpClientModule } from '@angular/common/http';

export function playerFactory() {
  return player;
}


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    StickersMemesComponent,
    MatesComponent,
    GrupoComponent,
    ItemComponent,
    PrincipalComponent,
    TiktokComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    BrowserAnimationsModule,
    MaterialModule,
    YouTubePlayerModule,
    LottieModule.forRoot({ player: playerFactory }),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
