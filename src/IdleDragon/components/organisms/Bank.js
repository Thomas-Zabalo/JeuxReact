import React, { useState } from 'react';
import { Bank as BankMolecule } from "../molecules";
import { Production, Money, Inventory } from "../../context";
import Images from '../../assets';
import { motion } from 'framer-motion';

export default function Bank() {
  const { Tap, totalCoinsPerSeconds } = Production.useProduction();
  const { coin, food, crystals, addGoldIngot, goldIngot } = Money.useMoney();
  const { dragonCount, farmCount } = Inventory.useInventory();

  const [animations, setAnimations] = useState([]);

  const createAnimation = () => {
    const bankImage = document.querySelector('.bank-center');
    const bankRect = bankImage.getBoundingClientRect();

    const centerX = bankRect.left + bankRect.width / 2;
    const centerY = bankRect.top + bankRect.height / 2;

    const randomOffset = {
      x: Math.random() > 0.5 ? Math.random() * 100 - 20 : -(Math.random() * 100 - 20),
      y: Math.random() * -100 - 40,
    };

    const isGoldIngot = Math.random() < 0.1;
    const value = isGoldIngot ? 1 : 1;

    setAnimations(prev => [
      ...prev,
      {
        id: Math.random(),
        from: { x: centerX, y: centerY },
        to: {
          x: centerX + randomOffset.x,
          y: centerY + randomOffset.y,
        },
        type: isGoldIngot ? 'goldIngot' : 'coin', // Détermine le type d'image
      }
    ]);

    if(isGoldIngot){
      addGoldIngot(value)
    } else {
      Tap(value)
    }
  };
  const formatValueInt = (value) => value.toFixed(0);
  const formatValue = (value) => value.toFixed(2);

  return (
    <div className='flex flex-col justify-around h-full w-full'>
      <BankMolecule.DamageBar coin={coin} totalCoinsPerSeconds={formatValue(totalCoinsPerSeconds)} farmCount={farmCount} dragonCount={dragonCount} />
      <div className='flex w-full justify-center bank-center p-8 relative'>
        <div className='flex w-56 h-56 cursor-pointer z-20'>
          <img
            src={Images.Bank}
            draggable="false"
            style={{
              transition: 'transform 150ms ease-in-out',
              transform: 'scale(1)',
              userSelect: 'none'
            }}
            onClick={() => {
              const img = document.querySelector('.clickable-img');
              img.style.transform = 'scale(0.95)';
              setTimeout(() => {
                img.style.transform = 'scale(1)';
              }, 150);
            
              createAnimation();
            }}
            
            className='clickable-img h-full w-full bank-center'
            alt='Image de la banque'
          />
        </div>
        {animations.map((animation) => (
          <motion.div
            key={animation.id}
            className='clickable-img z-10 flex items-center'
            initial={{ opacity: 1 }}
            animate={{
              x: animation.to.x - animation.from.x,
              y: animation.to.y - animation.from.y,
              opacity: 0,
              scale: 0.5,
              transition: { duration: 1 }
            }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute' }}
          >
            <img
              src={animation.type === 'coin' ? Images.Coin : Images.GoldIngot}
              alt={animation.type === 'coin' ? 'Piece animée' : 'Lingot d’or animé'}
              className={`relative ${animation.type === 'coin' ? 'w-10 h-10' : 'w-20 h-20'}`}
              draggable="false"
              style={{userSelect: 'none'}}
            />
            <span
              className={`ml-2 text-xl font-bold ${
                animation.type === 'coin' ? 'text-white' : 'text-white'
              }`}
            >
              {animation.type === 'coin' ? '+1' : '+1'}
            </span>
          </motion.div>
        ))}
      </div>
      <BankMolecule.MoneyBar coin={formatValueInt(coin)} food={formatValueInt(food)} crystals={formatValueInt(crystals)} goldIngot={goldIngot} />
    </div>
  );
  
  
}  