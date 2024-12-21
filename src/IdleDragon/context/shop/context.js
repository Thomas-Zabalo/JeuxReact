import React, { createContext, useContext, useEffect, useState } from 'react';
import itemsData from '../../items.json';
import { InventoryProvider, useInventory } from '../inventory';
import { useMoney } from '../money';

const ShopContext = createContext({});

export function ShopProvider({ children }) {
  const { addToInventory,dragonCount,farmCount} = useInventory();
  const { coin, crystals, removeCoin, removeCrystals } = useMoney();
  const [shopItems, setShopItems] = useState(itemsData)

  useEffect(() => {
    if (itemsData) {
      setShopItems(itemsData)
      
    }
  }, [itemsData])


  const buyItem = (itemId) => {
    const item = shopItems.find((item) => item.id === itemId);

    if (!item) return;

    if (item.category === 'dragon') {
      const requiredCrystals = item.priceBase*Math.pow(1+item.tauxPrice,dragonCount()+1); // Coût en cristaux pour les dragons   Problèmes de récupération d'inventaire
      
      if (crystals >= requiredCrystals) {
        
        removeCrystals(requiredCrystals); // Déduire les cristaux
        addToInventory({ ...item, level: 1,priceUpdate:requiredCrystals, }); // Ajouter le dragon à l'inventaire avec un niveau 1
        
        
      } else {
        alert('Pas assez de cristaux pour acheter ce dragon !');
      }
    } else if (item.category === 'farm') {
      const requiredCoins = item.priceBase*Math.pow(1+item.tauxPrice,farmCount()+1); // Coût en pièces pour les fermes Problèmes de récupération d'inventaire
      if (coin >= requiredCoins) {
        
        removeCoin(requiredCoins); // Déduire les pièces
        addToInventory({ ...item, level: 1, production: item.production }); // Ajouter la ferme avec une production initiale
      } else {
        alert('Pas assez de pièces pour acheter cette ferme !');
      }
    } else {
      // Pour les autres items génériques
      const requiredCoins = item.priceBase;
      if (coin >= requiredCoins) {
        removeCoin(requiredCoins);
        addToInventory({ ...item, level: 1 });
      } else {
        alert('Pas assez de pièces pour acheter cet article !');
      }
    }
  };

  return (
    <ShopContext.Provider value={{ shopItems, buyItem }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
