export interface StickerItem {
    id: number;
    nombre: string;
    categoria: string;
    tags: string[];
    url: string;
    tipo: 'sticker' | 'meme' | 'gif';
    origen: string;
    fechaAgregado: string;
    favorito: boolean;
    usos: number;
  }
  
  export interface GrupoSticker {
    nombre: string;
    categoria: string;
    cantidad: number;
    items: StickerItem[];
  }
  
  export interface SeccionSticker {
    [key: string]: GrupoSticker[];
  }
  
  export interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
  }
  