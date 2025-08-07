import Product from "./Production.jsx";
import Production from "./Production.jsx";

export default function Hero() {
    return (
        <>
            <main className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Colonna sinistra: contenuto */}
                <div>
                    <button
                        className="mb-6 flex items-center space-x-2 border border-indigo-600 text-indigo-600 text-xs rounded-full px-4 pr-1.5 py-1.5 hover:bg-indigo-50 transition"
                        type="button"
                    >
                        <span>Esplora i nostri servizi.</span>
                        <span className="flex items-center justify-center size-6 p-1 rounded-full bg-indigo-600">
        <svg
            width="14"
            height="11"
            viewBox="0 0 16 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M1 6.5h14M9.5 1 15 6.5 9.5 12"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
          />
        </svg>
      </span>
                    </button>

                    <h1 className="text-gray-900 font-bold text-3xl sm:text-4xl md:text-5xl leading-tight mb-4">
                        L’arte della stampa, l’affidabilità{" "}
                        <span className="text-indigo-600">dell’esperienza.</span>
                    </h1>

                    <p className="text-gray-600 max-w-md text-sm sm:text-base leading-relaxed mb-8">
                        Affidati alla nostra esperienza trentennale per dare forma ai tuoi progetti editoriali, commerciali e promozionali. Veloci, precisi, artigianali.
                    </p>

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

                {/* Colonna destra: immagine */}
                <div className="w-full">
                    <img
                        src="../public/plantone.png"
                        alt="Lavorazione tipografica"
                        className="  w-full h-auto object-cover"
                    />
                </div>
            </main>

            <Production/>
        </>
    )}
                