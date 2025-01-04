import { useEffect } from 'react';
import kaplayCtx from './kaplayCtx.js';
import {
    introDialog,
    mainMenu,
    mainGame
} from './scenes/index.js';

const SHOW_DIALOGS = true;

function App() {
    useEffect(() => {
        const k = kaplayCtx();
        k.scene('introDialog', () => introDialog(k));
        k.scene('mainGame', () => mainGame(k));
        k.scene('mainMenu', () => mainMenu(k));
        if(SHOW_DIALOGS) {
            k.go('introDialog');
        } else {
            k.go('mainGame');
        }
        return () => {
            k.canvas.remove();
            k.destroyAll();
        };
    }, []);
    return null;
}

export default App;