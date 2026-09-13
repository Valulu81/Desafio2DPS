import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import { store, persistor } from './src/redux/store';
import { useAppDispatch, useAppSelector } from './src/redux/hooks';
import { setFunciones } from './src/redux/slices/funcionesSlice';
import { funciones as funcionesEstaticas } from './src/data/funciones';

function AppInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const funcionesGuardadas = useAppSelector(state => state.funciones);

    useEffect(() => {
        if (funcionesGuardadas.length === 0) {
            dispatch(setFunciones(funcionesEstaticas as any));
        }
    }, []);

    return <>{children}</>;
}

export default function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AppInitializer>
                    <View style={{ flex: 1 }}>
                        <AppNavigator />
                    </View>
                </AppInitializer>
            </PersistGate>
        </Provider>
    );
}