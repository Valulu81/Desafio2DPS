export type EstadoAsiento = "libre" | "seleccionado" | "ocupado";

export interface Asiento {
    id: string;
    fila: string;
    numero: number;
    estado: EstadoAsiento;
}
