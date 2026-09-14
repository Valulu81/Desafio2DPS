import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Funcion } from "@/types/funcion";
import { Asiento } from "@/types/asiento";
import { funciones } from "@/data/funciones"; // Importamos la data base

const funcionesSlice = createSlice({
    name: "funciones",
    initialState: funciones as Funcion[], // Inicializamos con la data
    reducers: {
        setFunciones: (state, action: PayloadAction<Funcion[]>) => {
            return action.payload;
        },
        guardarAsientosFuncion: (
            state,
            action: PayloadAction<{ funcionId: string; asientos: Asiento[] }>
        ) => {
            const { funcionId, asientos } = action.payload;
            const funcion = state.find((f) => f.id === funcionId);
            if (funcion) {
                funcion.asientos = asientos;
            }
        },
    },
});

export const { setFunciones, guardarAsientosFuncion } = funcionesSlice.actions;
export default funcionesSlice.reducer;