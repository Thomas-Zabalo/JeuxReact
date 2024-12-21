import React from "react";
import { Production } from "../context";
import Images from '../assets';
import Bank from "../components/organisms/Bank";
import Inventory from "../components/organisms/Inventory";
import Shop from "../components/organisms/Shop";

export default function HomePage() {
    const { Tap } = Production.useProduction();

    return (
        <div className="flex flex-col h-screen w-full bg-gray-800 relative overflow-hidden">
            <div className="flex h-full w-full z-10">
                <div className="flex w-4/12">
                    <Bank />
                </div>
                <div className="flex w-2 bg-black" />
                <div className="flex w-5/12" >
                    <Inventory />
                </div>
                <div className="flex w-2 bg-black" />
                <div className="flex w-3/12">
                    <Shop />
                </div>
            </div>
            <div className="absolute bottom-0 z-0 w-full">
                <img className="h-full w-full" src={Images.MountainBg} alt="Background montagne" />
            </div>
        </div>
    );
}
