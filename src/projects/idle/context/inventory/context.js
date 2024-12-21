import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMoney } from '../money';

const InventoryContext = createContext({});

export function InventoryProvider({ children }) {
  const { removeCrystals, crystals, removeCoin, coin, removeFood } = useMoney();
  const [inventory, setInventory] = useState(() => {
    const savedInventory = localStorage.getItem('inventory');
    return savedInventory ? JSON.parse(savedInventory) : [];
  });
  const [dragonCount, setDragonCount] = useState(0);
  const [farmCount, setFarmCount] = useState(0);

  const countDragons = () => {
    
    return inventory.filter((item) => item.category === "dragon").length;
  };

  const countFarms = () => {
    return inventory.filter((item) => item.category === "farm").length;
  };

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    const countDragon = countDragons();
    const countFarm = countFarms();
    setDragonCount(countDragon);
    setFarmCount(countFarm)
  }, [inventory]);

  const addToInventory = (item) => {
    setInventory((prev) => [...prev, item]);
  };

  const upgradeDragon = (index) => {         
    setInventory((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          if (item.level < 20) {
            const upgradeCost = Math.floor(item.priceBase * Math.pow(1 + item.tauxUpgrade, item.level));
            if (upgradeCost <= crystals) {
              const updatedItem = {
                ...item,
                level: item.level + 1,
                upgrade: upgradeCost,
                gainCoins: item.gainCoins * Math.pow(1 + item.tauxGainCoins,item.level), 
                gainCrystals: item.gainCrystals * Math.pow(1 + item.tauxGainCrystals,item.level),
                
              };
              removeCrystals(upgradeCost);
              return updatedItem;
            } else {
              alert("Vous n'avez pas assez de cristaux !");
            }
          }
        }
        return item;
      })
    );
  };

  const upgradeFarm = (index) => {
    setInventory((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          if (item.level < 20) {
            const upgradeCost = Math.floor(item.priceBase * Math.pow(1 + item.tauxUpgrade, item.level));
            if (upgradeCost <= coin) {
              const updatedItem = {
                ...item,
                level: item.level + 1,
                upgrade: upgradeCost,
                gainFood: item.gainFood * Math.pow(1 + item.tauxGainFood,item.level),
              };
              removeCoin(upgradeCost);
              return updatedItem;
            } else {
              alert("Vous n'avez pas assez de pièces !");
            }
          }
        }
        return item;
      })
    );
  };

  const feedDragon = (index, amount) => {
    setInventory((prev) =>
      prev.map((item, i) => {
        if (i === index && item.category === "dragon") {
          const maxHunger = item.maxHunger;
          const newHungerState = Math.min(item.hungerState + amount, maxHunger);
          const foodConsumed = newHungerState - item.hungerState;

          if (foodConsumed > 0) {
            // Utilisation de removeFood pour gérer la consommation de nourriture
            removeFood(foodConsumed);
            
            return {
              ...item,
              hungerState: newHungerState,
              
            };
          } else {
            alert("Le dragon est déjà rassasié !");
          }
        }
        return item;
      })
    );
  };



  return (
    <InventoryContext.Provider value={{ inventory, addToInventory, upgradeDragon, upgradeFarm, dragonCount, farmCount, feedDragon }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => useContext(InventoryContext);
