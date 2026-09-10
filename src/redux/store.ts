import { configureStore } from "@reduxjs/toolkit";
import peliculasReducer from "./slices/peliculasSlice";
import reservasReducer from "./slices/reservasSlice";
import salasReducer from "./slices/salasSlice";
import funcionesReducer from "./slices/funcionesSlice";

export const store = configureStore({
    reducer: {
        peliculas: peliculasReducer,
        reservas: reservasReducer,
        salas: salasReducer,
        funciones: funcionesReducer, // 👈 ahora sí existe
    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
