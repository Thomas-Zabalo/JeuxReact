import Images from '../../assets'
import { Button } from '../atoms';

const ShopDragon = ({ dragons, onBuyDragon, crystals }) => {

    return (
        <div className='flex flex-col space-y-4 pb-8 w-full'>
            {dragons.map((dragon, index) => (
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
                                src={dragon.image}
                                alt={dragon.name}
                                className="w-16 h-16 object-cover"
                            />
                            <div className="flex flex-col w-full mx-4 items-center space-y-2">
                                <h2 className="text-white text-lg font-bold text-center">{dragon.name}</h2>
                                <p className="text-white text-sm text-center">
                                    {dragon.gainCoins} pièces / {dragon.gainCrystals} cristaux
                                </p>
                                <div className="flex items-center gap-1 text-center">
                                    <p className="text-white text-sm">Prix: {dragon.priceUpdate}</p>
                                    <img src={Images.Crystals} alt="Crystal" className="w-5 h-5" />
                                </div>
                                <Button.Primary
                                    disabled={crystals < dragon.priceUpdate}
                                    onClick={() => onBuyDragon(dragon)}
                                >
                                    Acheter
                                </Button.Primary>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ShopFarm = ({ farms, onBuyFarm, coin }) => {
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
                            <div className="flex flex-col w-full mx-4 items-center space-y-2">
                                <h2 className="text-white text-lg font-bold text-center">{farm.name}</h2>
                                <p className="text-white text-sm text-center">
                                    {farm.gainFood} food
                                </p>
                                <div className="flex items-center gap-1 text-center">
                                    <p className="text-white text-sm">Prix: {farm.priceBase}</p>
                                    <img src={Images.Coin} alt="Coin" className="w-5 h-5" />
                                </div>
                                <Button.Primary disabled={coin < farm.priceBase} onClick={() => onBuyFarm(farm)}>Acheter</Button.Primary>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export { ShopDragon, ShopFarm }