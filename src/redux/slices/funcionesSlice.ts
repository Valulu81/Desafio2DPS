// redux/slices/funcionesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Funcion } from "@/types/funcion";
import { Asiento } from "@/types/asiento";

const funcionesSlice = createSlice({
    name: "funciones",
    initialState: [] as Funcion[], // O { lista: [] } según tu estructura
    reducers: {
        setFunciones: (state, action: PayloadAction<Funcion[]>) => {
            return action.payload;
        },
        // 🔑 GUARDAR TODO EL MATRIZ DE ASIENTOS CON SUS ESTADOS
        guardarAsientosFuncion: (
            state,
            action: PayloadAction<{ funcionId: string; asientos: Asiento[] }>
        ) => {
            const { funcionId, asientos } = action.payload;
            const funcion = state.find((f) => f.id === funcionId);
            if (funcion) {
                funcion.asientos = asientos; // Sobrescribe con los asientos actualizados
            }
        },
    },
});

export const { setFunciones, guardarAsientosFuncion } = funcionesSlice.actions;
export default funcionesSlice.reducer;