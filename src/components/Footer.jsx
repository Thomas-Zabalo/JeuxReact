import React from 'react'

function Footer() {
    const navigation = [
        { name: 'Accueil', href: '#' },
        { name: 'Jeux', href: '#' }
    ]
    return (
        <footer class="bg-white rounded-lg shadow">
            <div class="w-full mx-auto max-w-screen-xl p-4 flex items-center justify-center">
                <span class="text-sm text-gray-500 sm:text-center ">© 2024 <a href="https://mmi.iut-tlse3.fr/" class="hover:underline">MMI CASTRES™</a>. Tous droit réservé.</span>
            </div>
        </footer>

    )
}

export default Footer