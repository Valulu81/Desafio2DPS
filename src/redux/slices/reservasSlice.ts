import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Asiento } from "@/types/asiento";
import { Reservas } from "@/types/reserva";

interface ReservasState {
    lista: Reservas[];
}

const initialState: ReservasState = {
    lista: [
        {
            id: "r1",
            nombre: "Valeria López",
            email: "valeria@example.com",
            pelicula: "Inception",
            hora: "19:00",
            boletos: 2,
            monto: 14.00,
            sala: "Sala 3"
        },
        {
            id: "r2",
            nombre: "Carlos Pérez",
            email: "carlos@example.com",
            pelicula: "Matrix",
            hora: "21:30",
            boletos: 3,
            monto: 21.00,
            sala: "Sala 5"
        }
    ]
};


const reservasSlice = createSlice({
    name: "reservas",
    initialState,
    reducers: {
        agregarReserva: (state, action: PayloadAction<Reservas>) => {
            state.lista.push(action.payload);
        },
    },
});

export const { agregarReserva } = reservasSlice.actions;
export default reservasSlice.reducer;