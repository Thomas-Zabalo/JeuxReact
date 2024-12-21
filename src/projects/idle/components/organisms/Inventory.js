import React, { useState } from 'react';
import { useInventory } from '../../context/inventory';
import { useMoney } from '../../context/money';
import { Inventory as InventoryMolecule } from '../molecules';

export default function Inventory() {
  const { inventory } = useInventory();
  const { crystals, coin, food } = useMoney()
  const [step, setStep] = useState("dragon")

  const dragons = inventory.filter((item) => item.category === 'dragon');
  const farms = inventory.filter((item) => item.category === 'farm');

  return (
    <div className="flex flex-col h-full w-full">
      <div className='flex justify-center items-center pt-6 w-full'>
        <h2 className='font-bold text-white text-3xl'>Inventaire</h2>
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
        {step === "dragon" && <InventoryMolecule.InventoryDragon dragons={dragons} crystals={crystals} food={food} />}
        {step === "farm" && <InventoryMolecule.InventoryFarm farms={farms} coin={coin} />}
      </div>
    </div>
  );
}
