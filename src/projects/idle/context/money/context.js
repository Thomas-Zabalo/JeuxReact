import React, { createContext, useContext, useState, useEffect } from 'react';

// Création du contexte MoneyContext
const MoneyContext = createContext({
  coin: 0,
  crystals: 0,
  food: 0,
  goldIngot: 0,
  addGoldIngot: (amount) => { },
  removeGoldIngot: (amount) => { },
  addCoin: (amount) => { },
  removeCoin: (amount) => { },
  addCrystals: (amount) => { },
  removeCrystals: (amount) => { },
  addFood: (amount) => { },
  removeFood: (amount) => { },
});

export function MoneyProvider({ children }) {
  const [coin, setCoin] = useState(() => {
    const savedCoin = localStorage.getItem('coin');
    return savedCoin ? JSON.parse(savedCoin) : 0;
  });
  const [crystals, setCrystals] = useState(() => {
    const savedCrystals = localStorage.getItem('crystals');
    return savedCrystals ? JSON.parse(savedCrystals) : 100;
  });
  const [food, setFood] = useState(() => {
    const savedFood = localStorage.getItem('food');
    return savedFood ? JSON.parse(savedFood) : 0;
  });
  const [goldIngot, setGoldIngot] = useState(() => {
    const savedGoldIngot = localStorage.getItem('goldIngot');
    return savedGoldIngot ? JSON.parse(savedGoldIngot) : 0;
  });


  // Ajout et retrait de coins
  const addCoin = (amount) => setCoin((prev) => prev + amount);
  const removeCoin = (amount) => setCoin((prev) => Math.max(0, prev - amount));

  // Ajout et retrait de cristaux
  const addCrystals = (amount) => setCrystals((prev) => prev + amount);
  const removeCrystals = (amount) =>
    setCrystals((prev) => Math.max(0, prev - amount));

  // Ajout et retrait de lingots d'or
  const addGoldIngot = (amount) => setGoldIngot((prev) => prev + amount);
  const removeGoldIngot = (amount) =>
    setGoldIngot((prev) => Math.max(0, prev - amount));
  

  // Ajout et retrait de nourriture
  const addFood = (amount) => setFood((prev) => prev + amount);
  const removeFood = (amount) => setFood((prev) => Math.max(0, prev - amount));


  useEffect(() => {
    localStorage.setItem('coin', JSON.stringify(coin));
    localStorage.setItem('crystals', JSON.stringify(crystals));
    localStorage.setItem('food', JSON.stringify(food));
    localStorage.setItem('goldIngot', JSON.stringify(goldIngot));
  }, [coin, crystals, food, goldIngot]);

  return (
    <MoneyContext.Provider
      value={{
        coin,
        crystals,
        food,
        goldIngot,
        addGoldIngot,
        removeGoldIngot,
        addCoin,
        removeCoin,
        addCrystals,
        removeCrystals,
        addFood,
        removeFood,
      }}
    >
      {children}
    </MoneyContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte MoneyContext
export const useMoney = () => useContext(MoneyContext);
