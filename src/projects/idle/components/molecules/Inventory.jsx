import Images from '../../assets'
import { useInventory } from '../../context/inventory';
import { Button } from '../atoms';

const InventoryDragon = ({ dragons, crystals, food }) => {
    const { upgradeDragon, feedDragon } = useInventory();
    const formatValue = (value) => value.toFixed(0);

    return (
        <div className="flex flex-col space-y-4 pb-8 w-full">
            {dragons.map((dragon, index) => (
                <div
                    key={index}
                    className="flex flex-col border-[10px] w-full border-zinc-200 bg-zinc-200 z-20"
                    style={{
                        clipPath:
                            "polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)",
                    }}
                >
                    <div
                        className="flex flex-col h-full w-full px-4 py-2 bg-neutral-900"
                        style={{
                            clipPath:
                                "polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)",
                        }}
                    >
                        <div className="flex lg:flex-row h-full w-full items-center">
                            <img
                                src={dragon.image}
                                alt={dragon.name}
                                className="w-16 h-16 object-cover"
                            />
                            <div className="flex mx-4 flex-col w-full items-center space-y-2">
                                <h2 className="text-white text-lg font-bold text-center">{dragon.name}</h2>
                                <p className="text-white text-sm text-center">Niveau : {dragon.level}</p>
                                <p className="text-white text-sm text-center">
                                    {formatValue(dragon.gainCoins)} pièces / {formatValue(dragon.gainCrystals)} cristaux
                                </p>
                                <div className="flex items-center gap-1 text-center">
                                    <p className="text-white text-sm">Prix: {dragon.upgrade}</p>
                                    <img src={Images.Crystals} alt="Crystal" className="w-5 h-5" />
                                </div>
                                {dragon.level < 20 ? (
                                    <Button.Primary
                                        disabled={crystals < dragon.upgrade}
                                        onClick={() => upgradeDragon(index)}
                                    >
                                        Améliorer
                                    </Button.Primary>
                                ) : (
                                    <span className="text-gray-500">Niveau maximum</span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col pt-6 pb-2">
                            <div className="flex w-full justify-between">
                                <p className="text-white">Barre de faim</p>
                                <p className="text-white">
                                    {formatValue(dragon.hungerState)} / {dragon.maxHunger}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-6 my-2 overflow-hidden shadow-inner">
                                    <div
                                        className="bg-green-500 h-full transition-all duration-300"
                                        style={{
                                            width: `${Math.min(
                                                (dragon.hungerState / dragon.maxHunger) * 100,
                                                100
                                            )}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex w-full space-x-4 pt-4 pb-2">
                                <Button.Primary
                                    disabled={food < dragon.hunger || dragon.hungerState + 1 > dragon.maxHunger}
                                    onClick={() => feedDragon(index, 1)}
                                >
                                    +1
                                </Button.Primary>
                                <Button.Primary
                                    disabled={food < dragon.hunger*10 || dragon.hungerState + 10 > dragon.maxHunger}
                                    onClick={() => feedDragon(index, 10)}
                                >
                                    +10
                                </Button.Primary>
                                <Button.Primary
                                    disabled={food < dragon.hunger*100 || dragon.hungerState + 100 > dragon.maxHunger}
                                    onClick={() => feedDragon(index, 100)}
                                >
                                    +100
                                </Button.Primary>
                                <Button.Primary
                                    disabled={food < dragon.maxHunger || dragon.hungerState >= dragon.maxHunger }
                                    onClick={() => feedDragon(index, dragon.maxHunger - dragon.hungerState)}
                                >
                                    Max
                                </Button.Primary>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};


const InventoryFarm = ({ farms, coin }) => {

    const { upgradeFarm } = useInventory()
    return (
        <div className='flex flex-col space-y-4 pb-8 w-full'>
            {farms.map((farm, index) => (
                <div
                    key={index}
                    className="flex flex-col border-[10px] w-full border-zinc-200 bg-zinc-200 z-20"
                    style={{
                        clipPath: 'polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)',
                    }}
                >
                    <div
                        className="flex flex-col h-full w-full px-4 py-2 bg-neutral-900"
                        style={{
                            clipPath: 'polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)',
                        }}
                    >
                        <div className="flex flex-col lg:flex-row h-full w-full items-center">
                            <img
                                src={farm.image}
                                alt={farm.name}
                                className="w-16 h-16 object-cover"
                            />
                            <div className="flex mx-4 flex-col w-full items-center space-y-2">
                                <h2 className="text-white text-lg font-bold text-center">{farm.name}</h2>
                                <p className="text-white text-sm text-center">
                                    Niveau : {farm.level}
                                </p>
                                <p className="text-white text-sm text-center">
                                    {Math.floor(farm.gainFood)} food / s
                                </p>
                                <div className="flex items-center gap-1 text-center">
                                    <p className="text-white text-sm">Prix: {farm.upgrade}</p>
                                    <img src={Images.Coin} alt="Coin" className="w-5 h-5" />
                                </div>
                                {farm.level < 20 ? (
                                    <Button.Primary disabled={coin < farm.upgrade} onClick={() => upgradeFarm(index)}>Améliorer</Button.Primary>
                                ) : (
                                    <span className="text-gray-500">Niveau maximum</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export { InventoryDragon, InventoryFarm }