import React from 'react';
import { Link } from 'react-router-dom';  // Importation du composant Link

function Card() {
    const dataCard = [
        {
            name: "Idle Game",
            image: "https://zbt4714a.mmiweb.iut-tlse3.fr/wp-content/uploads/2024/11/347976466-7d594da9-68e7-43e4-8856-300fc5cb70df.png",
            link: "/project/idle-app",
            collaborators: [
                { name: "Evan" },
                { name: "Thomas Cerquiera" }
            ],
        },
        {
            name: "Football Américain",
            image: "",
            link: "/project/football-app",
            collaborators: ["Lisa", "Clement", "Lucas"],
        },
        {
            name: "Sonic",
            image: "https://zbt4714a.mmiweb.iut-tlse3.fr/wp-content/uploads/2024/11/347976466-7d594da9-68e7-43e4-8856-300fc5cb70df.png",
            link: "/project/sonic-app",
            collaborators: ["Elias", "Théo", "Maxime"],
        },
        {
            name: "SubwaySurfer",
            image: "https://zbt4714a.mmiweb.iut-tlse3.fr/wp-content/uploads/2024/11/347976466-7d594da9-68e7-43e4-8856-300fc5cb70df.png",
            link: "/project/SubwaySurfer-app",
            collaborators: ["Ogene", "Mohammed", "Thomas ZABALO"],
        },
        {
            name: "Application Dessin",
            image: "https://zbt4714a.mmiweb.iut-tlse3.fr/wp-content/uploads/2024/11/347976466-7d594da9-68e7-43e4-8856-300fc5cb70df.png",
            link: "/project/coloring-app",
            collaborators: ["Safwa"],
        }
    ];

    const avatars = [
        { src: "https://www.gravatar.com/avatar/1d7d586c9f650fcd16f43f8c915f97ff?s=96&d=retro&r=g" },
        { src: "https://www.gravatar.com/avatar/d18d4b8b0735b6637731d2f2a2ab7a1c?s=96&d=retro&r=g" },
        { src: "https://www.gravatar.com/avatar/33c6d5cb43cf68de1f68a3c3428c4574?s=96&d=retro&r=g" },
        { src: "https://www.gravatar.com/avatar/8c0c672881a5f8395e56f46a4163e3b4?s=96&d=retro&r=g" }
    ];

    return (
        <section className='lg:px-6 pb-12 lg:pb-32'>
            <div className="flex justify-between items-center mb-8 lg:mb-28">
                <h2 className="text-xl lg:text-3xl font-bold">Quelques jeux réalisés.</h2>
            </div>

            <section className='hidden md:block'>
                <div id='projet' className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {dataCard.map((project, index) => (
                        <Link key={index} to={project.link} className="block p-6 bg-[#EDEEF0] rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                            <article className="flex flex-col h-full">
                                <h3 className="text-base font-semibold mb-4 hover:text-blue-600">{project.name}</h3>
                                <img className="object-cover w-full h-36 rounded mb-4" src={project.image} alt={project.name} />
                                <div className="flex items-center justify-between space-x-2 mt-auto">
                                    <div className="flex items-center">
                                        <div className="flex -space-x-3 rtl:space-x-reverse">
                                            {project.collaborators.map((collaborator, idx) => (
                                                <img
                                                    key={idx}
                                                    className="inline-block size-6 rounded-full"
                                                    src={avatars[idx % avatars.length].src}
                                                    alt={`avatar de ${collaborator.name || collaborator}`}
                                                />
                                            ))}
                                        </div>
                                        <div>
                                            {project.collaborators.map((collaborator, idx) => (
                                                <p
                                                    key={`text-${idx}`}
                                                    className="inline-block text-sm ml-2"
                                                >
                                                    [{collaborator.name || collaborator}]
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </section>
            <section className='md:hidden'>
                <ul className="divide-y divide-gray-100">
                    {dataCard.map((project, index) => (
                        <li key={index} className="flex justify-between gap-x-6 py-5">
                            <div className="flex min-w-0 gap-x-4">
                                <img alt="" src={project.image} className="object-cover size-12 flex-none rounded-md bg-gray-50" />
                                <div className="min-w-0 flex-auto">
                                    <p className="text-sm/6 font-semibold text-gray-900">{project.name}</p>
                                    <div className="flex -space-x-3 rtl:space-x-reverse">
                                        {project.collaborators.map((collaborator, idx) => (
                                            <img
                                                key={idx}
                                                className="inline-block size-6 rounded-full"
                                                src={avatars[idx % avatars.length].src}
                                                alt={`avatar de ${collaborator.name || collaborator}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
                                <button className="rounded-md border-slate-200 py-2 px-4 border border-transparent text-center text-sm text-black transition-all shadow-md hover:shadow-lg focus:bg-slate-300 focus:shadow-none active:bg-slate-300 hover:bg-slate-400 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" type="button">
                                    Voir
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </section>
    );
}

export default Card;
