export default function Info() {
    return (
        <section className="text-gray-600 body-font">
            <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                <div
                    className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                    <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Da oltre 30 anni, stampiamo
                        <br className="hidden lg:inline-block"/>le vostre idee
                    </h1>
                    <p className="mb-8 leading-relaxed">Fondata nel 1995, la Tipografia Ideal nasce con l’obiettivo di offrire un servizio di stampa che unisca l’attenzione artigianale ai vantaggi della tecnologia moderna. Da allora, accompagniamo aziende, privati ed enti pubblici nella realizzazione di materiali editoriali, pubblicitari e commerciali, con un occhio attento alla qualità, ai dettagli e al rispetto delle tempistiche.
                    </p>
                    <div className="flex justify-center">
                        <button
                            className="bg-indigo-600 text-white px-6 pr-2.5 py-2.5 rounded-full text-sm font-medium flex items-center space-x-2 hover:bg-indigo-700 transition"
                            type="button"
                        >
                            <span>RICHIEDI UN PREVENTIVO</span>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4.821 11.999h13.43m0 0-6.714-6.715m6.715 6.715-6.715 6.715"
                                    stroke="#fff"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                    <img className="object-cover object-center rounded-[20px]" alt="hero"
                         src="./public/chi-siamo.jpg"/>
                </div>
            </div>
        </section>
    )
}