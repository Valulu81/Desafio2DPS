import { Funcion } from "@/types/funcion";
import { Asiento } from "@/types/asiento";

const generarAsientos = (filas: number, columnas: number) => {
    const asientos = [];
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let f = 0; f < filas; f++) {
        for (let c = 1; c <= columnas; c++) {
            asientos.push({
                id: `${letras[f]}${c}`,
                fila: letras[f],
                numero: c,
                estado: (Math.random() > 0.8 ? 'ocupado' : 'libre') as Asiento['estado']
            });
        }
    }
    return asientos;
};

export const funciones = [
    {
        id: "f1",
        peliculaId: "p1",
        hora: "13:00",
        salaId: "s1",
        asientos: [] // se llena con el estado de los asientos
    },
    {
        id: "f2",
        peliculaId: "p1",
        hora: "16:30",
        salaId: "s1",
        asientos: []
    },
    {
        id: "f3",
        peliculaId: "p1",
        hora: "20:00",
        salaId: "s3",
        asientos: []
    },
    {
        id: "f4",
        peliculaId: "p2",
        hora: "14:00",
        salaId: "s2",
        asientos: []
    },
    {
        id: "f5",
        peliculaId: "p2",
        hora: "8:30",
        salaId: "s1",
        asientos: []
    },
    {
        id: "f6",
        peliculaId: "p3",
        hora: "10:00",
        salaId: "s3",
        asientos: []
    },
    {
        id: "f7",
        peliculaId: "p4",
        hora: "11:00",
        salaId: "s2",
        asientos: []
    },
    {
        id: "f8",
        peliculaId: "p4",
        hora: "15:00",
        salaId: "s3",
        asientos: []
    }
];
