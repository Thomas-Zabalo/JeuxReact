import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useMoney } from '../money';
import { useInventory } from '../inventory';

const ProductionContext = createContext({
    Tap: (value) => { },
    totalCoinsPerSeconds: 0,
    totalFoodPerSeconds: 0, // Nouveau state pour le total de nourriture
});

export function ProductionProvider({ children }) {
    const { inventory } = useInventory();
    const { addCoin, addCrystals, addFood } = useMoney();

    const [tapMultiplier, setTapMultiplier] = useState(1);
    const [totalCoinsPerSeconds, setTotalCoinsPerSeconds] = useState(0);
    const [totalFoodPerSeconds, setTotalFoodPerSeconds] = useState(0);

    const [totalTapPerSeconds, setTotalTapPerSeconds] = useState(0);
    const [totalDragonPerSeconds, setTotalDragonPerSeconds] = useState(0);

    const totalTapPerSecondsLocalRef = useRef(0);

    // Génération automatique des pièces, cristaux et nourriture
    useEffect(() => {
        const calculateTotalCoins = () => {
            return inventory.reduce((sum, item) => {
                if (item.category === "dragon" && item.hungerState > 0) {
                    const gain = item.gainCoins * Math.pow(1 + item.tauxGainCoins, item.level);
                    if (item.hungerState > 0) {
                        const foodConsume = item.hungerState - (item.hunger - item.tauxHunger);
                        item.hungerState = foodConsume
                    }

                    return sum + gain;
                }
                item.hungerState = 0
                return sum;
            }, 0);
        };

        const calculateTotalCrystals = () => {
            return inventory.reduce((sum, item) => {
                if (item.category === "dragon" && item.hungerState > 0) {
                    const gain = item.gainCrystals * Math.pow(1 + item.tauxGainCrystals, item.level);
                    return sum + gain;
                }
                return sum;
            }, 0);
        };

        const calculateTotalFood = () => {
            return inventory.reduce((sum, item) => {
                if (item.category === "farm") {
                    const gain = item.gainFood * Math.pow(1 + item.tauxGainFood, item.level);
                    return sum + gain;
                }
                return sum;
            }, 0);
        };

        const interval = setInterval(() => {
            const totalCoins = calculateTotalCoins();
            const totalCrystals = calculateTotalCrystals();
            const totalFood = calculateTotalFood();

            setTotalDragonPerSeconds(totalCoins); // Mise à jour pour les dragons
            setTotalFoodPerSeconds(totalFood);    // Mise à jour pour les fermes

            addCoin(totalCoins);
            addCrystals(totalCrystals);
            addFood(totalFood)
        }, 1000);

        return () => clearInterval(interval);
    }, [inventory, addCoin, addCrystals]);

    // Gestion des taps
    const Tap = (value) => {
        addCoin(value * tapMultiplier);
        totalTapPerSecondsLocalRef.current += value;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTotalTapPerSeconds(totalTapPerSecondsLocalRef.current);
            totalTapPerSecondsLocalRef.current = 0;
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setTotalCoinsPerSeconds(totalDragonPerSeconds + totalTapPerSeconds);
    }, [totalDragonPerSeconds, totalTapPerSeconds]);

    return (
        <ProductionContext.Provider
            value={{
                Tap,
                setTapMultiplier,
                totalCoinsPerSeconds,
                totalFoodPerSeconds, // Exposer le gain de nourriture par seconde
            }}
        >
            {children}
        </ProductionContext.Provider>
    );
}

export const useProduction = () => useContext(ProductionContext);
