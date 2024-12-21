import React, { useState, useEffect } from 'react';
import { useMoney } from '../../context/money';
import { useInventory } from '../../context/inventory';
import { Shop as ShopMolecule } from '../molecules';
import Images from '../../assets';
import { useShop } from '../../context/shop';

export default function Shop() {
  const { crystals, removeCrystals, coin, removeCoin } = useMoney();
  const { shopItems } = useShop()
  const { addToInventory } = useInventory();
  const [dragons, setDragons] = useState([]);
  const [farms, setFarms] = useState([]);

  const [step, setStep] = useState("dragon")

  useEffect(() => {
    const categorizedItems = shopItems.reduce(
      (acc, item) => {
        const imageSource =
          item.category === 'dragon'
            ? Images.Dragon[item.image]
            : item.category === 'farm'
              ? Images.Farm[item.image]
              : null;

        if (item.category === 'dragon') {
          acc.dragons.push({ ...item, image: imageSource });
        } else if (item.category === 'farm') {
          acc.farms.push({ ...item, image: imageSource });
        }
        return acc;
      },
      { dragons: [], farms: [] }
    );

    setDragons(categorizedItems.dragons);
    setFarms(categorizedItems.farms);
  }, [shopItems]);



  const handleBuyDragon = (dragon) => {
    if (crystals >= dragon.priceBase) {
      removeCrystals(dragon.priceBase);
      addToInventory(dragon);
      alert(`Félicitations ! Vous avez acheté ${dragon.name}.`);
    } else {
      alert("Vous n'avez pas assez de cristaux pour acheter ce dragon.");
    }
  };

  const handleBuyFarm = (farm) => {
    if (coin >= farm.priceBase) {
      removeCoin(farm.priceBase);
      addToInventory(farm);
      alert(`Félicitations ! Vous avez acheté ${farm.name}.`);
    } else {
      alert("Vous n'avez pas assez de pièces pour acheter cette ferme.");
    }
  };

  if (!dragons.length) {
    return <p>Chargement des dragons...</p>;
  }

  if (!farms.length) {
    return <p>Chargement des fermes...</p>;
  }

  return (
    <div className="flex flex-col w-full">
      <div className='flex justify-center items-center pt-6 w-full'>
        <h2 className='font-bold text-white text-3xl'>Magasin</h2>
      </div>
      <div className='flex w-full py-6 justify-around'>
        <div onClick={() => setStep("dragon")} className={`flex py-1 px-4 cursor-pointer font-semibold ${step === "dragon" ? "text-black bg-white rounded" : "text-white bg-transparent"}`}>
          <p>Dragons</p>
        </div>
        <div onClick={() => setStep("farm")} className={`flex py-1 px-4 cursor-pointer font-semibold ${step === "farm" ? "text-black bg-white rounded" : "text-white bg-transparent"}`}>
          <p>Fermes</p>
        </div>
      </div>
      <div className='flex px-8 flex-col w-full overflow-y-auto'>
        {step === "dragon" && <ShopMolecule.ShopDragon dragons={dragons} onBuyDragon={handleBuyDragon} crystals={crystals} />}
        {step === "farm" && <ShopMolecule.ShopFarm farms={farms} onBuyFarm={handleBuyFarm} coin={coin} />}
      </div>
    </div >
  );
}