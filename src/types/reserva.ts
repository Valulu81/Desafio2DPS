export interface Reservas {
    id: string;
    nombre: string;
    email: string;
    pelicula: string;
    hora: string;
    boletos: number;
    monto: number;
    sala: string;
    canjeado: boolean;
    asientos?: string[];
    codigo?: string;
    imagen?: string;
}
