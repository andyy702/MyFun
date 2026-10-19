import { Component } from '@angular/core';

@Component({
  selector: 'app-tiktok',
  templateUrl: './tiktok.component.html',
  styleUrls: ['./tiktok.component.css']
})
export class TiktokComponent {
   // Secciones (tabs superiores): Favoritos, Deportes, Trending
  secciones = [
    // {
    //   nombre: 'Favoritos',
    //   grupos: [
    //     {
    //       nombre: 'Videos Graciosos',
    //       items: [
    //         {
    //           link: 'assets/tiktok1.jpg',
    //           titulo: 'Fails de cocina épicos',
    //           autor: 'chefmaster',
    //           views: '1.8M',
    //           duration: '0:30',
    //           tags: ['cocina','fails']
    //         },
    //         {
    //           link: 'assets/tiktok2.jpg',
    //           titulo: 'Gato bailando reggaeton',
    //           autor: 'catdancer123',
    //           views: '2.3M',
    //           duration: '0:15',
    //           tags: ['gatos','baile']
    //         }
    //       ]
    //     },
    //     {
    //       nombre: 'Tutoriales Útiles',
    //       items: [
    //         {
    //           link: 'assets/tiktok3.jpg',
    //           titulo: 'Trucos de productividad en 60 segundos',
    //           autor: 'productivityhacks',
    //           views: '890K',
    //           duration: '1:00',
    //           tags: ['productividad','tips']
    //         }
    //       ]
    //     }
    //   ]
    // },

    // {
    //   nombre: 'Deportes',
    //   grupos: [
    //     {
    //       nombre: 'Highlights',
    //       items: [
    //         {
    //           link: 'assets/tiktok4.jpg',
    //           titulo: 'Golazo de último minuto',
    //           autor: 'sportsfan',
    //           views: '420K',
    //           duration: '0:20',
    //           tags: ['futbol','gol']
    //         }
    //       ]
    //     }
    //   ]
    // },

    // {
    //   nombre: 'Trending',
    //   grupos: [
    //     {
    //       nombre: 'Lo más visto',
    //       items: [
    //         {
    //           link: 'assets/tiktok5.jpg',
    //           titulo: 'Retos virales 2025',
    //           autor: 'viralhub',
    //           views: '3.2M',
    //           duration: '0:45',
    //           tags: ['viral','reto']
    //         }
    //       ]
    //     }
    //   ]
    // }
  ];
}
