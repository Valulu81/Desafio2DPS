import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Salas } from "@/types/sala";

interface SalasState {
    lista: Salas[];
}

const initialState: SalasState = {
    lista: [],
};

const salasSlice = createSlice({
    name: "salas",
    initialState,
    reducers: {
        setSalas: (state, action: PayloadAction<Salas[]>) => {
            state.lista = action.payload;
        },
    },
});

export const { setSalas } = salasSlice.actions;
export default salasSlice.reducer;