import { useState } from 'react';

export default function Portfolio() {
    const [activeCategory, setActiveCategory] = useState('tutti');
    const [selectedProject, setSelectedProject] = useState(null);

    const categories = [
        { id: 'tutti', name: 'Tutti i Progetti', icon: '🎯' },
        { id: 'offset', name: 'Stampa Offset', icon: '📖' },
        { id: 'digitale', name: 'Stampa Digitale', icon: '🖨️' },
        { id: 'grande-formato', name: 'Grande Formato', icon: '🎪' },
        { id: 'packaging', name: 'Packaging', icon: '📦' },
        { id: 'editoria', name: 'Editoria', icon: '📚' },
        { id: 'finiture', name: 'Finiture Speciali', icon: '✨' }
    ];

    const projects = [
        {
            id: 1,
            title: "Catalogo Prodotti Aziendali",
            category: "offset",
            image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Catalogo premium per azienda del settore automotive, 120 pagine in quadricromia su carta patinata opaca.",
            details: {
                client: "AutoTech Solutions",
                format: "21x29.7 cm",
                pages: "120 pagine",
                quantity: "2.500 copie",
                finishing: "Rilegatura brossura, plastificazione opaca"
            },
            tags: ["Catalogo", "Offset", "Automotive"]
        },
        {
            id: 2,
            title: "Biglietti da Visita Premium",
            category: "digitale",
            image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Serie di biglietti da visita personalizzati con stampa oro a caldo e verniciatura UV selettiva.",
            details: {
                client: "Studio Legale Rossi & Partners",
                format: "8.5x5.5 cm",
                quantity: "500 copie per 6 professionisti",
                finishing: "Stampa oro a caldo, verniciatura UV, carta 350g"
            },
            tags: ["Biglietti", "Digitale", "Finiture Speciali"]
        },
        {
            id: 3,
            title: "Timbri Autoinchiostranti",
            category: "digitale",
            image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Timbro autoinchiostrante per azienda con stampa ad alta definizione.",
            details: {
                client: "Azienda XYZ",
                format: "EOS30",
                material: "Plastica",
                quantity: "3 pezzi",
                finishing: "Ricarica inchiostro gratuita se necessaria"
            },
            tags: ["Banner", "Grande Formato", "Esterno"]
        },
        {
            id: 4,
            title: "Packaging E-commerce Premium",
            category: "packaging",
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Scatole personalizzate per brand di cosmetici con design elegante e sostenibile.",
            details: {
                client: "BeautyNature Cosmetics",
                format: "15x10x8 cm",
                material: "Cartone riciclabile 300g",
                quantity: "1.000 pezzi",
                finishing: "Stampa CMYK + 1 pantone, plastificazione soft touch"
            },
            tags: ["Packaging", "E-commerce", "Sostenibile"]
        },
        {
            id: 5,
            title: "Libro d'Arte Fotografico",
            category: "editoria",
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Volume fotografico d'arte con stampa fine art su carta speciale e rilegatura cartonata.",
            details: {
                client: "Fotografo Marco Bianchi",
                format: "24x30 cm",
                pages: "80 pagine",
                quantity: "200 copie numerate",
                finishing: "Rilegatura cartonata, sovraccoperta, carta fine art"
            },
            tags: ["Libro", "Arte", "Fine Art"]
        },
        {
            id: 6,
            title: "Inviti Matrimonio Eleganti",
            category: "finiture",
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Partecipazioni matrimoniali con rilievo a secco e dettagli dorati, carta premium.",
            details: {
                client: "Matrimonio Elena & Andrea",
                format: "12x18 cm con busta coordinata",
                quantity: "150 sets completi",
                finishing: "Rilievo a secco, stampa oro, carta cotone 300g"
            },
            tags: ["Inviti", "Matrimonio", "Rilievo"]
        },
        {
            id: 7,
            title: "Brochure Aziendale Multilingue",
            category: "offset",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Brochure corporate per azienda internazionale, versioni in 4 lingue con grafica coordinata.",
            details: {
                client: "TechGlobal Industries",
                format: "A4 - 3 ante",
                languages: "Italiano, Inglese, Tedesco, Francese",
                quantity: "5.000 copie totali",
                finishing: "Carta patinata lucida, plastificazione"
            },
            tags: ["Brochure", "Corporate", "Multilingue"]
        },
        {
            id: 8,
            title: "Adesivi per Flotta Aziendale",
            category: "grande-formato",
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Adesivazione completa di 15 veicoli commerciali con grafica coordinata aziendale.",
            details: {
                client: "Corriere Express Sud",
                vehicles: "15 furgoni",
                material: "Vinile cast premium, laminazione UV",
                coverage: "Adesivazione totale veicoli",
                finishing: "Installazione professionale inclusa"
            },
            tags: ["Adesivi", "Flotta", "Veicoli"]
        },
        {
            id: 9,
            title: "Menu Ristorante Design",
            category: "digitale",
            image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Menu eleganti per ristorante stellato con design custom e materiali di qualità.",
            details: {
                client: "Ristorante Villa dei Sapori",
                format: "A3 aperto, A4 chiuso",
                versions: "Menu degustazione + Carta vini",
                quantity: "100 copie per versione",
                finishing: "Carta texture lino, plastificazione anti-graffio"
            },
            tags: ["Menu", "Ristorante", "Design"]
        }
    ];

    const filteredProjects = activeCategory === 'tutti'
        ? projects
        : projects.filter(project => project.category === activeCategory);

    const openModal = (project) => {
        setSelectedProject(project);
    };

    const closeModal = () => {
        setSelectedProject(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header Section */}
            <div className="pt-20 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Il Nostro Portfolio
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Scopri alcuni dei progetti più significativi che abbiamo realizzato.
                            Ogni lavoro racconta una storia di qualità, precisione e creatività.
                        </p>
                        <div className="flex justify-center">
                            <div className="w-24 h-1 bg-indigo-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
                                activeCategory === category.id
                                    ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                                    : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-md'
                            }`}
                        >
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                            onClick={() => openModal(project)}
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.slice(0, 2).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 bg-white/90 text-gray-800 text-xs rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* View Details Button */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="bg-white/90 p-2 rounded-full">
                                        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                                    {project.title}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {project.description}
                                </p>

                                {/* Quick Info */}
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-1">
                                        {project.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                            Nessun progetto trovato
                        </h3>
                        <p className="text-gray-600">
                            Prova a selezionare una categoria diversa
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
                    <div
                        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="relative">
                            <img
                                src={selectedProject.image}
                                alt={selectedProject.title}
                                className="w-full h-64 md:h-80 object-cover"
                            />
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8">
                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedProject.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    {selectedProject.title}
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {selectedProject.description}
                                </p>
                            </div>

                            {/* Project Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Dettagli del Progetto</h3>
                                    <div className="space-y-3">
                                        {Object.entries(selectedProject.details).map(([key, value]) => (
                                            <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                                                <span className="text-gray-600 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                                </span>
                                                <span className="font-medium text-gray-900">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Interessato a un progetto simile?</h3>
                                    <p className="text-gray-600 mb-6">
                                        Contattaci per discutere del tuo progetto e ricevere un preventivo personalizzato.
                                    </p>
                                    <div className="space-y-3">
                                        <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                            <a href="/preventivo">
                                                Richiedi Preventivo
                                            </a>
                                        </button>
                                        <button className="w-full border border-indigo-600 text-indigo-600 py-3 px-6 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                                            <a
                                                href="https://wa.me/393770802322"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors"
                                            >
                                                Contattaci su WhatsApp
                                            </a>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CTA Section */}
            <div className="bg-white py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        Hai un progetto in mente?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Ogni progetto è unico come la tua visione.
                        Raccontaci la tua idea e la trasformeremo in realtà con la nostra esperienza trentennale.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-indigo-600 text-white px-8 py-4 rounded-full font-medium hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                            <a href="/preventivo">
                                Inizia il Tuo Progetto
                            </a>

                        </button>
                        <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-full font-medium hover:bg-indigo-50 transition-all duration-200">
                            Sfoglia Altri Lavori
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}