import React from 'react'

function Header() {
    const navigation = [
        { name: 'Accueil', href: '/' },
        { name: 'Jeux', href: '#jeux' }
    ]
    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Store de Jeux</span>
                        <img
                            alt="Logo du Store de Jeux"
                            src="/5260498.png"
                            className="h-8 w-auto"
                        />
                    </a>
                </div>
                <div className="flex gap-x-12">
                    {navigation.map((item) => (
                        <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900">
                            {item.name}
                        </a>
                    ))}
                </div>
            </nav>
        </header>
    )
}

export default Header