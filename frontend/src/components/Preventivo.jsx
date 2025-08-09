import { useState } from 'react';

// Componente FileUpload integrato
const FileUploadComponent = ({ onFileChange, hasFile }) => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');

    // Non mostrare il componente se l'utente ha selezionato "No" per i file
    if (hasFile === 'false') {
        return null;
    }

    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'application/zip',
        'application/x-rar-compressed'
    ];

    const getFileTypeLabel = (type) => {
        const typeMap = {
            'application/pdf': 'PDF',
            'application/msword': 'DOC',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
            'text/plain': 'TXT',
            'image/jpeg': 'JPG',
            'image/png': 'PNG',
            'application/zip': 'ZIP',
            'application/x-rar-compressed': 'RAR'
        };
        return typeMap[type] || 'File';
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleFileUpload = (file) => {
        setError('');

        // Validazione tipo file
        if (!allowedTypes.includes(file.type)) {
            setError('Tipo di file non supportato. Formati accettati: PDF, DOC, DOCX, TXT, JPG, PNG, ZIP, RAR');
            return;
        }

        // Validazione dimensione file (max 25MB)
        if (file.size > 25 * 1024 * 1024) {
            setError('Il file è troppo grande. Dimensione massima: 25MB');
            return;
        }

        const fileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            file: file
        };

        setUploadedFile(fileData);

        // Callback al componente genitore
        if (onFileChange) {
            onFileChange(fileData);
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
        setError('');
        if (onFileChange) {
            onFileChange(null);
        }
    };

    return (
        <div className="w-full mt-6">
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carica File <span className="text-gray-500">(opzionale)</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                    Carica qui i tuoi file pronti per la stampa
                </p>
            </div>

            {!uploadedFile ? (
                <div>
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
                            isDragging
                                ? 'border-indigo-400 bg-indigo-50 scale-[1.02]'
                                : error
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <svg className={`mx-auto h-8 w-8 mb-3 ${error ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-700">
                                Trascina il file qui o{' '}
                                <label className="text-indigo-600 hover:text-indigo-700 cursor-pointer underline">
                                    seleziona dal computer
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar"
                                    />
                                </label>
                            </p>
                            <p className="text-xs text-gray-500">
                                PDF, DOC, DOCX, TXT, JPG, PNG, ZIP, RAR • Max 25MB
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-2 flex items-center text-sm text-red-600">
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            {error}
                        </div>
                    )}
                </div>
            ) : (
                <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate" title={uploadedFile.name}>
                                    {uploadedFile.name}
                                </p>
                                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                    <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">
                                        {getFileTypeLabel(uploadedFile.type)}
                                    </span>
                                    <span>{formatFileSize(uploadedFile.size)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <button
                                onClick={removeFile}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                                title="Rimuovi file"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function Preventivo() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [formData, setFormData] = useState({
        // Step 1 - Informazioni base
        nome: '',
        cognome: '',
        email: '',
        telefono: '',
        azienda: '',

        // Step 2 - Tipo di progetto
        tipoProgetto: '',
        servizio: '',
        urgenza: '',

        // Step 3 - Dettagli specifici
        quantita: '',
        formato: '',
        pagine: '',
        colori: '',
        carta: '',
        finiture: [],

        // Step 4 - File e note
        hasFile: '',
        fileInfo: '',
        uploadedFile: null,
        note: '',
        budget: '',

        // Privacy
        privacy: false,
        newsletter: false
    });

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        if (type === 'checkbox') {
            if (name === 'finiture') {
                setFormData(prev => ({
                    ...prev,
                    finiture: checked
                        ? [...prev.finiture, value]
                        : prev.finiture.filter(f => f !== value)
                }));
            } else {
                setFormData(prev => ({...prev, [name]: checked}));
            }
        } else {
            setFormData(prev => ({...prev, [name]: value}));
        }
    };

    const handleFileChange = (fileData) => {
        setFormData(prev => ({...prev, uploadedFile: fileData}));
    };

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Prepara i dati per l'invio con FormData per supportare file upload
            const formDataToSend = new FormData();

            // Aggiungi tutti i campi del form
            Object.keys(formData).forEach(key => {
                if (key === 'uploadedFile' && formData[key]) {
                    // Aggiungi il file se presente
                    formDataToSend.append('file', formData[key].file);
                    formDataToSend.append('fileName', formData[key].name);
                } else if (key === 'finiture') {
                    // Aggiungi array come JSON string
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else if (key !== 'uploadedFile') {
                    // Aggiungi tutti gli altri campi, anche se vuoti
                    const value = formData[key];
                    if (value !== null && value !== undefined) {
                        formDataToSend.append(key, value);
                    }
                }
            });

            console.log('📝 Dati FormData preparati per invio');
            // Log per debug (non mostra il file)
            for (let [key, value] of formDataToSend.entries()) {
                if (key !== 'file') {
                    console.log(`${key}:`, value);
                }
            }

            // URL del backend
            const backendUrl = import.meta.env.REACT_APP_API_URL || '';
            const response = await fetch(`${backendUrl}/api/preventivo`, {
                method: 'POST',
                body: formDataToSend
            });

            let result;
            const contentType = response.headers.get('content-type');

            // Controlla se la risposta è JSON
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                // Se non è JSON, è probabilmente una pagina di errore HTML
                const text = await response.text();
                console.error('Risposta non JSON:', text);
                throw new Error('Errore del server. La richiesta potrebbe essere troppo grande.');
            }

            if (response.ok && result.success) {
                setSubmitStatus('success');
                // Reset form dopo successo
                setFormData({
                    nome: '', cognome: '', email: '', telefono: '', azienda: '',
                    tipoProgetto: '', servizio: '', urgenza: '',
                    quantita: '', formato: '', pagine: '', colori: '', carta: '', finiture: [],
                    hasFile: '', fileInfo: '', uploadedFile: null, note: '', budget: '',
                    privacy: false, newsletter: false
                });
                setCurrentStep(1);

                // Scroll to top per mostrare messaggio di successo
                window.scrollTo({top: 0, behavior: 'smooth'});

            } else {
                // Log degli errori dettagliati per debug
                console.error('Errore validazione:', result);
                if (result.errors && Array.isArray(result.errors)) {
                    console.error('Errori specifici:', result.errors);
                }
                throw new Error(result.message || 'Errore durante l\'invio');
            }

        } catch (error) {
            console.error('Errore invio preventivo:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const progressPercentage = (currentStep / 4) * 100;

    // Costanti per servizi e tipi progetto
    const servizi = [
        {id: 'offset', name: 'Stampa Offset', icon: '🖨️', desc: 'Ideale per grandi tirature'},
        {id: 'digitale', name: 'Stampa Digitale', icon: '💻', desc: 'Perfetta per piccole quantità'},
        {id: 'grande-formato', name: 'Grande Formato', icon: '🎪', desc: 'Banner, striscioni, insegne'},
        {id: 'packaging', name: 'Packaging', icon: '📦', desc: 'Scatole e contenitori personalizzati'},
        {id: 'editoria', name: 'Editoria', icon: '📚', desc: 'Libri, cataloghi, riviste'},
        {id: 'finiture', name: 'Finiture Speciali', icon: '✨', desc: 'Verniciature, rilievi, oro/argento'}
    ];

    const tipiProgetto = [
        {
            id: 'business',
            name: 'Materiale Aziendale',
            icon: '💼',
            items: ['Biglietti da visita', 'Brochure', 'Cataloghi', 'Carta intestata']
        },
        {
            id: 'marketing',
            name: 'Materiale Promozionale',
            icon: '📢',
            items: ['Volantini', 'Locandine', 'Banner', 'Gadget']
        },
        {
            id: 'eventi',
            name: 'Eventi Speciali',
            icon: '🎉',
            items: ['Inviti matrimonio', 'Partecipazioni', 'Menu', 'Programmi']
        },
        {id: 'editoria', name: 'Prodotti Editoriali', icon: '📖', items: ['Libri', 'Riviste', 'Tesi', 'Manuali']},
        {id: 'packaging', name: 'Packaging', icon: '📦', items: ['Scatole', 'Etichette', 'Shopper', 'Contenitori']},
        {id: 'altro', name: 'Altro Progetto', icon: '🎯', items: ['Progetto personalizzato']}
    ];

    const formatoOpzioni = [
        'A4 (21x29.7 cm)', 'A5 (14.8x21 cm)', 'A3 (29.7x42 cm)',
        'A6 (10.5x14.8 cm)', '10x15 cm', '13x18 cm',
        'Formato personalizzato', 'Grande formato'
    ];

    const cartaOpzioni = [
        'Carta normale 80g', 'Carta patinata lucida 130g', 'Carta patinata opaca 130g',
        'Carta patinata lucida 170g', 'Carta patinata opaca 170g', 'Carta patinata lucida 250g',
        'Carta patinata opaca 250g', 'Cartoncino 300g', 'Carta riciclata', 'Carta speciale'
    ];

    const finitureOpzioni = [
        {id: 'plastificazione-lucida', name: 'Plastificazione Lucida'},
        {id: 'plastificazione-opaca', name: 'Plastificazione Opaca'},
        {id: 'verniciatura-uv', name: 'Verniciatura UV Selettiva'},
        {id: 'stampa-oro', name: 'Stampa Oro a Caldo'},
        {id: 'stampa-argento', name: 'Stampa Argento a Caldo'},
        {id: 'rilievo-secco', name: 'Rilievo a Secco'},
        {id: 'fustellatura', name: 'Fustellatura'},
        {id: 'cordonatura', name: 'Cordonatura'},
        {id: 'rilegatura', name: 'Rilegatura'}
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">

            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
                <div
                    className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 max-w-md">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <div>
                            <p className="font-semibold">Richiesta Inviata!</p>
                            <p className="text-sm">Ti ricontatteremo entro 24 ore</p>
                        </div>
                    </div>
                </div>
            )}

            {submitStatus === 'error' && (
                <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 max-w-md">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                        <div>
                            <p className="font-semibold">Errore Invio</p>
                            <p className="text-sm">Riprova o contattaci direttamente</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Richiedi il Tuo Preventivo
                    </h1>
                    <p className="text-xl text-blue-100 mb-8">
                        Compila il form per ricevere un preventivo dettagliato e gratuito entro 24 ore
                    </p>

                    {/* Progress Bar */}
                    <div className="max-w-lg mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            {[1, 2, 3, 4].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                                            step <= currentStep
                                                ? 'bg-white text-indigo-600 shadow-lg'
                                                : 'bg-indigo-500 text-indigo-200'
                                        }`}>
                                        {step < currentStep ? '✓' : step}
                                    </div>
                                    {step < 4 && (
                                        <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-500 ${
                                            step < currentStep ? 'bg-white' : 'bg-indigo-400'
                                        }`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="w-full bg-indigo-400 rounded-full h-2">
                            <div
                                className="bg-white h-2 rounded-full transition-all duration-500 ease-in-out"
                                style={{width: `${progressPercentage}%`}}
                            ></div>
                        </div>
                        <p className="text-blue-100 text-sm mt-2">
                            Step {currentStep} di 4
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

                    <form onSubmit={handleSubmit}>

                        {/* Step 1: Informazioni Personali */}
                        {currentStep === 1 && (
                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <div
                                        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl text-white mx-auto mb-4">
                                        👤
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        I Tuoi Dati
                                    </h2>
                                    <p className="text-gray-600">
                                        Iniziamo con le informazioni di contatto per poterti ricontattare
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nome *
                                        </label>
                                        <input
                                            type="text"
                                            name="nome"
                                            required
                                            value={formData.nome}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Mario"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cognome *
                                        </label>
                                        <input
                                            type="text"
                                            name="cognome"
                                            required
                                            value={formData.cognome}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Rossi"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="mario@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Telefono *
                                        </label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            required
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="+39 123 456 7890"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Azienda (opzionale)
                                        </label>
                                        <input
                                            type="text"
                                            name="azienda"
                                            value={formData.azienda}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Nome dell'azienda"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2 - Tipo di Progetto */}
                        {currentStep === 2 && (
                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <div
                                        className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl text-white mx-auto mb-4">
                                        🎯
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        Che Cosa Vuoi Stampare?
                                    </h2>
                                    <p className="text-gray-600">
                                        Seleziona il tipo di progetto per ricevere consigli personalizzati
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {tipiProgetto.map((tipo) => (
                                        <div
                                            key={tipo.id}
                                            className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                                                formData.tipoProgetto === tipo.id
                                                    ? 'border-indigo-500 bg-indigo-50 shadow-lg transform scale-105'
                                                    : 'border-gray-200 hover:border-indigo-300'
                                            }`}
                                            onClick={() => setFormData(prev => ({...prev, tipoProgetto: tipo.id}))}
                                        >
                                            <div className="text-3xl mb-3 text-center">{tipo.icon}</div>
                                            <h3 className="font-semibold text-gray-900 mb-2 text-center">{tipo.name}</h3>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                {tipo.items.slice(0, 3).map((item, idx) => (
                                                    <li key={idx} className="flex items-center">
                                                            <span
                                                                className="w-1 h-1 bg-indigo-400 rounded-full mr-2"></span>
                                                        {item}
                                                    </li>
                                                ))}
                                                {tipo.items.length > 3 && (
                                                    <li className="text-indigo-600 font-medium">e altro...</li>
                                                )}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                {formData.tipoProgetto && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                                Seleziona il servizio specifico *
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {servizi.map((servizio) => (
                                                    <div
                                                        key={servizio.id}
                                                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                                                            formData.servizio === servizio.id
                                                                ? 'border-indigo-500 bg-indigo-50'
                                                                : 'border-gray-200 hover:border-indigo-300'
                                                        }`}
                                                        onClick={() => setFormData(prev => ({
                                                            ...prev,
                                                            servizio: servizio.id
                                                        }))}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <span className="text-xl">{servizio.icon}</span>
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">{servizio.name}</h4>
                                                                <p className="text-sm text-gray-600">{servizio.desc}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Urgenza del progetto *
                                            </label>
                                            <select
                                                name="urgenza"
                                                required
                                                value={formData.urgenza}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            >
                                                <option value="">Seleziona la tempistica</option>
                                                <option value="urgente">Urgente (1-3 giorni) - Sovrapprezzo 20%
                                                </option>
                                                <option value="normale">Normale (5-7 giorni)</option>
                                                <option value="rilassato">Non ho fretta (10-15 giorni) - Sconto
                                                    10%
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Dettagli Tecnici */}
                        {currentStep === 3 && (
                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <div
                                        className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center text-2xl text-white mx-auto mb-4">
                                        ⚙️
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        Dettagli Tecnici
                                    </h2>
                                    <p className="text-gray-600">
                                        Specifica le caratteristiche tecniche per un preventivo preciso
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Quantità *
                                            </label>
                                            <input
                                                type="number"
                                                name="quantita"
                                                required
                                                min="1"
                                                value={formData.quantita}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                placeholder="500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Formato *
                                            </label>
                                            <select
                                                name="formato"
                                                required
                                                value={formData.formato}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            >
                                                <option value="">Seleziona formato</option>
                                                {formatoOpzioni.map((formato, idx) => (
                                                    <option key={idx} value={formato}>{formato}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Numero di pagine (se applicabile)
                                            </label>
                                            <input
                                                type="number"
                                                name="pagine"
                                                min="1"
                                                value={formData.pagine}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                placeholder="8"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Colori *
                                            </label>
                                            <select
                                                name="colori"
                                                required
                                                value={formData.colori}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            >
                                                <option value="">Seleziona colori</option>
                                                <option value="1+0">Nero fronte (1+0)</option>
                                                <option value="1+1">Nero fronte/retro (1+1)</option>
                                                <option value="4+0">Quadricromia fronte (4+0)</option>
                                                <option value="4+1">Quadricromia fronte + nero retro (4+1)</option>
                                                <option value="4+4">Quadricromia fronte/retro (4+4)</option>
                                                <option value="pantone">Con colori Pantone</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tipo di carta *
                                        </label>
                                        <select
                                            name="carta"
                                            required
                                            value={formData.carta}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        >
                                            <option value="">Seleziona tipo di carta</option>
                                            {cartaOpzioni.map((carta, idx) => (
                                                <option key={idx} value={carta}>{carta}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-4">
                                            Finiture speciali (opzionale)
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {finitureOpzioni.map((finitura) => (
                                                <label key={finitura.id}
                                                       className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        name="finiture"
                                                        value={finitura.id}
                                                        checked={formData.finiture.includes(finitura.id)}
                                                        onChange={handleChange}
                                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{finitura.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: File e Note - AGGIORNATO */}
                        {currentStep === 4 && (
                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <div
                                        className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-2xl text-white mx-auto mb-4">
                                        📎
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        File e Informazioni Aggiuntive
                                    </h2>
                                    <p className="text-gray-600">
                                        Completa con eventuali file e note per finalizzare la richiesta
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hai già i file pronti?
                                        </label>
                                        <div className="space-y-4">
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="radio"
                                                    name="hasFile"
                                                    value="true"
                                                    checked={formData.hasFile === 'true'}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                                />
                                                <span>Sì, ho i file pronti</span>
                                            </label>
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="radio"
                                                    name="hasFile"
                                                    value="false"
                                                    checked={formData.hasFile === 'false'}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                                />
                                                <span>No, ho bisogno di aiuto per la progettazione</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* NUOVO: Componente di Upload File */}
                                    <FileUploadComponent
                                        onFileChange={handleFileChange}
                                        hasFile={formData.hasFile}
                                    />

                                    {/* Campo descrizione file - mostrato solo se non ha caricato file ma ha detto di averli */}
                                    {formData.hasFile === 'true' && !formData.uploadedFile && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Informazioni sui file
                                            </label>
                                            <textarea
                                                name="fileInfo"
                                                value={formData.fileInfo}
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                                                placeholder="Descrivi i file che hai (formato, risoluzione, etc.) o indica come preferisci inviarli"
                                            />
                                            <p className="text-sm text-gray-500 mt-2">
                                                💡 Potrai inviarci i file via email o WhatsApp dopo aver ricevuto il
                                                preventivo
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Budget indicativo (opzionale)
                                        </label>
                                        <select
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        >
                                            <option value="">Seleziona budget</option>
                                            <option value="0-100">€ 0 - 100</option>
                                            <option value="100-300">€ 100 - 300</option>
                                            <option value="300-500">€ 300 - 500</option>
                                            <option value="500-1000">€ 500 - 1.000</option>
                                            <option value="1000-2000">€ 1.000 - 2.000</option>
                                            <option value="2000+">Oltre € 2.000</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Note aggiuntive
                                        </label>
                                        <textarea
                                            name="note"
                                            value={formData.note}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                                            placeholder="Aggiungi qualsiasi informazione aggiuntiva che ritieni utile per il preventivo..."
                                        />
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-gray-200">
                                        <label className="flex items-start space-x-3">
                                            <input
                                                type="checkbox"
                                                name="privacy"
                                                required
                                                checked={formData.privacy}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1"
                                            />
                                            <span className="text-sm text-gray-700">
                                                Accetto il trattamento dei dati personali secondo la{' '}
                                                <a href="/privacy"
                                                   className="text-indigo-600 hover:text-indigo-700 underline">
                                                    Privacy Policy
                                                </a> *
                                            </span>
                                        </label>

                                        <label className="flex items-start space-x-3">
                                            <input
                                                type="checkbox"
                                                name="newsletter"
                                                checked={formData.newsletter}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1"
                                            />
                                            <span className="text-sm text-gray-700">
                                                Desidero ricevere offerte speciali e novità via email
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div
                            className="px-8 py-6 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center space-x-4">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={isSubmitting}
                                        className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M15 19l-7-7 7-7"/>
                                        </svg>
                                        <span>Indietro</span>
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center space-x-4">
                                {currentStep < 4 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={
                                            isSubmitting ||
                                            (currentStep === 1 && (!formData.nome || !formData.cognome || !formData.email || !formData.telefono)) ||
                                            (currentStep === 2 && (!formData.tipoProgetto || !formData.servizio || !formData.urgenza)) ||
                                            (currentStep === 3 && (!formData.quantita || !formData.formato || !formData.colori || !formData.carta))
                                        }
                                        className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
                                    >
                                        <span>Continua</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M9 5l7 7-7 7"/>
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={!formData.privacy || isSubmitting}
                                        className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin w-5 h-5" fill="none"
                                                     viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10"
                                                            stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor"
                                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Invio in corso...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                                                </svg>
                                                <span>Invia Richiesta</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}