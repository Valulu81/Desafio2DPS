import { Asiento } from "./asiento";

export interface Funcion {
    id: string;
    hora: string; 
    salaId: string;
    asientos: Asiento[];
}