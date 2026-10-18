import { Component } from '@angular/core';

@Component({
  selector: 'app-mates',
  templateUrl: './mates.component.html',
  styleUrls: ['./mates.component.css']
})
export class MatesComponent {
  secciones = [
    {
      nombre: "videos",
      grupos:[
        {
          nombre: "Álgebra",
          items: [
            { link: "https://www.youtube.com/embed/OmJ-4B-mS-Y" },
            { link: "https://www.youtube.com/embed/n46kqcHQ1oo" }
          ]
        },
        {
          nombre: "Cálculo",
          items: [
            { link: "https://www.youtube.com/embed/FHLsTqxW9uc" }
          ]
        }
      ]
    },
    {
      nombre: "libros",
      grupos:[
        {
          nombre: "Lógica y Pruebas",
          items: [
            { link: "https://books.google.com/books?id=ejemplo1" }
          ]
        }
      ]
    },
    {
      nombre: "articulos",
      grupos:[
        {
          nombre: "Teoría de Números",
          items: [
            { link: "https://doi.org/ejemplo1" }
          ]
        }
      ]
    }
  ];
}
