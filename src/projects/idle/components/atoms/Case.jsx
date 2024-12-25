import React from 'react'

const Money = ({ img, number }) => {
    return (
        <div className='flex items-center h-1/4 w-1/2'>
            <div className='flex h-6 w-6'>
                <img src={img} alt={`Case ${number}`} className='w-full h-full' />
            </div>
            <div>
                <p className='text-white pl-2 font-bold'>{number}</p>
            </div>
        </div>
    )
}

const Damage = ({ img, number }) => {
    return (
        <div className='flex items-center h-1/4 w-1/2'>
            <div className='flex h-6 w-6'>
                <img src={img} alt={`Case ${number}`} className='w-full h-full' />
            </div>
            <div>
                <p className='text-white pl-2 font-bold'>{number}</p>
            </div>
        </div>
    )
}

export { Money, Damage }
