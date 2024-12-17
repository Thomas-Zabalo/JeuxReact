import React from 'react'

function Header() {

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
            </nav>
        </header>
    )
}

export default Header