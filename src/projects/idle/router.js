import React from 'react';
import Pages from './pages/index.js';

import { Money, Shop, Inventory, Production } from './context/index.js';

const Router = () => {
    return (
        <>
            <Money.MoneyProvider>
                <Shop.ShopProvider>
                    <Inventory.InventoryProvider>
                        <Production.ProductionProvider>
                            <Pages.HomePage />
                        </Production.ProductionProvider>
                    </Inventory.InventoryProvider>
                </Shop.ShopProvider>
            </Money.MoneyProvider>
        </>
    );
};

export default Router;
