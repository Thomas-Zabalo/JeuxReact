import React from 'react'
import { Case } from '../atoms'
import Images from '../../assets';

const MoneyBar = ({ coin, food, crystals, goldIngot }) => {
    return (
        <div
            className="flex flex-col border-[10px] justify-evenly border-zinc-200 bg-zinc-200 mx-4 h-[15%] z-20"
            style={{
                clipPath: 'polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)',
            }}
        >
            <div className='flex flex-col px-4 justify-evenly items-center h-full w-full bg-neutral-900' style={{
                clipPath: 'polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)',
            }}>
                <div className='flex w-full items-center'>
                    <Case.Money img={Images.Coin} number={coin} />
                    <Case.Money img={Images.Chicken} number={food} />
                </div>
                <div className='flex w-full items-center'>
                    <Case.Money img={Images.Crystals} number={crystals} />
                    <Case.Money img={Images.GoldIngot} number={goldIngot} />
                </div>

            </div>
        </div>
    )
}

const DamageBar = ({ totalCoinsPerSeconds, farmCount, dragonCount }) => {
    return (
        <div
            className="flex flex-col border-[10px] justify-evenly border-zinc-200 bg-zinc-200 mx-4 h-[15%] z-20"
            style={{
                clipPath: 'polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)',
            }}
        >
            <div className='flex flex-col px-4 justify-evenly items-center h-full w-full bg-neutral-900' style={{
                clipPath: 'polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)',
            }}>
                <div className='flex w-full items-center'>
                    <Case.Damage img={Images.Sword} number={0} />
                    <Case.Damage img={Images.Clock} number={totalCoinsPerSeconds} />
                </div>
                <div className='flex w-full items-center'>
                    <Case.Damage img={Images.FarmIcon} number={farmCount} />
                    <Case.Damage img={Images.DragonIcon} number={dragonCount} />
                </div>
            </div>
        </div>
    )
}

export { MoneyBar, DamageBar }
