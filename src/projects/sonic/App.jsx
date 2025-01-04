import React, { useEffect } from 'react';
import main from './main';
import './App.css';

function App() {
    useEffect(() => {
        main();
    });
    return <p>{'Sonic Game'}</p>;
}

export default App;
