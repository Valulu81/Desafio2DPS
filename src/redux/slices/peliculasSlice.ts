import {
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";

import { Pelicula } from "@/types/pelicula";
import { peliculas } from "@/data/peliculas";

const initialState: Pelicula[] = peliculas;

const peliculasSlice = createSlice({
    name: "peliculas",

    initialState,

    reducers: {
        addPelicula: (
            state,
            action: PayloadAction<Omit<Pelicula, "id">>
        ) => {

            const nuevoId =
                state.length > 0
                    ? Math.max(...state.map(p => p.id)) + 1
                    : 1;

            state.push({
                id: nuevoId,
                ...action.payload,
            });
        },

        editPelicula: (
            state,
            action: PayloadAction<Pelicula>
        ) => {

            const index = state.findIndex(
                p => p.id === action.payload.id
            );

            if (index !== -1) {
                state[index] = action.payload;
            }
        },

        deletePelicula: (
            state,
            action: PayloadAction<number>
        ) => {
            return state.filter(
                p => p.id !== action.payload
            );
        },

        toggleEstado: (
            state,
            action: PayloadAction<number>
        ) => {

            const pelicula = state.find(
                p => p.id === action.payload
            );

            if (pelicula) {
                pelicula.estado =
                    pelicula.estado === "Disponible"
                        ? "No disponible"
                        : "Disponible";
            }
        },
    },
});

export const {
    addPelicula,
    editPelicula,
    deletePelicula,
    toggleEstado,
} = peliculasSlice.actions;

export default peliculasSlice.reducer;