import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reservas } from "@/types/reserva";

interface ReservasState {
    lista: Reservas[];
}

// 1. Aquí vaciamos los datos de prueba de Matrix e Inception
const initialState: ReservasState = {
    lista: [] 
};

const reservasSlice = createSlice({
    name: "reservas",
    initialState,
    reducers: {
        agregarReserva: (state, action: PayloadAction<Reservas>) => {
            state.lista.push({ ...action.payload, canjeado: false });
        },
        canjearBoleto: (state, action: PayloadAction<string>) => {
            const reserva = state.lista.find(r => r.id === action.payload);
            if (reserva) reserva.canjeado = true;
        }
    },
});

export const { agregarReserva, canjearBoleto } = reservasSlice.actions;
export default reservasSlice.reducer;