
export interface Pelicula {
    id: number;
    codigo: string;
    nombre: string;
    genero: string;
    duracion: number; // en minutos
    clasificacion: string;
    funciones?: string[]; // Lista de funciones asociadas a la película
    precio: number;
    estado: "Disponible" | "No disponible";
    imagen: string;
    descripcion?: string;
}