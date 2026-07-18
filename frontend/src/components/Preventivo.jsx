import { useState } from 'react';
import { User, Package } from 'lucide-react';

const FileUploadComponent = ({ onFileChange }) => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');

    const allowedTypes = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain','image/jpeg','image/png','application/zip','application/x-rar-compressed'];
    const getFileTypeLabel = (type) => ({ 'application/pdf':'PDF','application/msword':'DOC','application/vnd.openxmlformats-officedocument.wordprocessingml.document':'DOCX','text/plain':'TXT','image/jpeg':'JPG','image/png':'PNG','application/zip':'ZIP','application/x-rar-compressed':'RAR' }[type] || 'File');
    const formatFileSize = (bytes) => { if (bytes === 0) return '0 Bytes'; const k=1024,sizes=['Bytes','KB','MB','GB'],i=Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(2))+' '+sizes[i]; };

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); const files = Array.from(e.dataTransfer.files); if (files.length > 0) handleFileUpload(files[0]); };
    const handleFileSelect = (e) => { const file = e.target.files[0]; if (file) handleFileUpload(file); };

    const handleFileUpload = (file) => {
        setError('');
        if (!allowedTypes.includes(file.type)) { setError('Tipo di file non supportato. Formati accettati: PDF, DOC, DOCX, TXT, JPG, PNG, ZIP, RAR'); return; }
        if (file.size > 25 * 1024 * 1024) { setError('Il file è troppo grande. Dimensione massima: 25MB'); return; }
        const fileData = { name: file.name, size: file.size, type: file.type, file };
        setUploadedFile(fileData);
        if (onFileChange) onFileChange(fileData);
    };

    const removeFile = () => { setUploadedFile(null); setError(''); if (onFileChange) onFileChange(null); };

    return (
        <div className="w-full">
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Carica File <span className="text-gray-500">(opzionale)</span></label>
                <p className="text-xs text-gray-500 mb-3">Carica qui i tuoi file pronti per la stampa</p>
            </div>
            {!uploadedFile ? (
                <div>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${isDragging ? 'border-teal-400 bg-teal-50 scale-[1.02]' : error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-teal-300 hover:bg-gray-50'}`}
                         onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                        <svg className={`mx-auto h-8 w-8 mb-3 ${error ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-700">Trascina il file qui o{' '}
                                <label className="text-teal-600 hover:text-teal-700 cursor-pointer underline">seleziona dal computer
                                    <input type="file" className="hidden" onChange={handleFileSelect} accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar" />
                                </label>
                            </p>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT, JPG, PNG, ZIP, RAR • Max 25MB</p>
                        </div>
                    </div>
                    {error && (<div className="mt-2 flex items-center text-sm text-red-600"><svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>{error}</div>)}
                </div>
            ) : (
                <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0"><svg className="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate" title={uploadedFile.name}>{uploadedFile.name}</p>
                                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                                    <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-medium">{getFileTypeLabel(uploadedFile.type)}</span>
                                    <span>{formatFileSize(uploadedFile.size)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <button onClick={removeFile} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50" title="Rimuovi file">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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
        nome:'', cognome:'', email:'', telefono:'', azienda:'',
        quantita:'', uploadedFile:null, note:'', privacy:false, newsletter:false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFileChange = (fileData) => setFormData(prev => ({...prev, uploadedFile: fileData}));
    const nextStep = () => { if (currentStep < 2) setCurrentStep(currentStep + 1); };
    const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'uploadedFile') {
                    if (formData.uploadedFile) {
                        formDataToSend.append('file', formData.uploadedFile.file);
                        formDataToSend.append('fileName', formData.uploadedFile.name);
                    }
                } else {
                    const value = formData[key];
                    if (value !== null && value !== undefined) formDataToSend.append(key, value);
                }
            });
            const backendUrl = import.meta.env.VITE_API_URL || 'https://nodejs-p9se-production.up.railway.app';
            const response = await fetch(`${backendUrl}/api/preventivo`, { method: 'POST', body: formDataToSend });
            let result;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) { result = await response.json(); }
            else { const text = await response.text(); console.error('Risposta non JSON:', text); throw new Error('Errore del server.'); }
            if (response.ok && result.success) {
                setSubmitStatus('success');
                setFormData({ nome:'', cognome:'', email:'', telefono:'', azienda:'', quantita:'', uploadedFile:null, note:'', privacy:false, newsletter:false });
                setCurrentStep(1);
                window.scrollTo({top: 0, behavior: 'smooth'});
            } else { throw new Error(result.message || 'Errore durante l\'invio'); }
        } catch (error) { console.error('Errore invio preventivo:', error); setSubmitStatus('error'); }
        finally { setIsSubmitting(false); }
    };

    const progressPercentage = (currentStep / 2) * 100;

    const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors";

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
            {submitStatus === 'success' && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 max-w-md">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <div><p className="font-semibold">Richiesta Inviata!</p><p className="text-sm">Ti ricontatteremo entro 24 ore</p></div>
                    </div>
                </div>
            )}
            {submitStatus === 'error' && (
                <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 max-w-md">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                        <div><p className="font-semibold">Errore Invio</p><p className="text-sm">Riprova o contattaci direttamente</p></div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Richiedi il Tuo Preventivo</h1>
                    <p className="text-xl text-teal-100 mb-8">Compila il form per ricevere un preventivo gratuito entro 24 ore</p>
                    <div className="max-w-lg mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            {[1,2].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${step <= currentStep ? 'bg-white text-teal-600 shadow-lg' : 'bg-teal-500 text-teal-200'}`}>
                                        {step < currentStep ? '✓' : step}
                                    </div>
                                    {step < 2 && (<div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${step < currentStep ? 'bg-white' : 'bg-teal-400'}`}></div>)}
                                </div>
                            ))}
                        </div>
                        <div className="w-full bg-teal-400 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full transition-all duration-500 ease-in-out" style={{width: `${progressPercentage}%`}}></div>
                        </div>
                        <p className="text-teal-100 text-sm mt-2">Step {currentStep} di 2</p>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <form onSubmit={handleSubmit}>

                        {/* Step 1 — Dati cliente */}
                        {currentStep === 1 && (
                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4"><User className="w-8 h-8" /></div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">I Tuoi Dati</h2>
                                    <p className="text-gray-600">Iniziamo con le informazioni di contatto per poterti ricontattare</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label><input type="text" name="nome" required value={formData.nome} onChange={handleChange} className={inputClass} placeholder="Mario" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Cognome *</label><input type="text" name="cognome" required value={formData.cognome} onChange={handleChange} className={inputClass} placeholder="Rossi" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Email *</label><input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="mario@example.com" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Telefono *</label><input type="tel" name="telefono" required value={formData.telefono} onChange={handleChange} className={inputClass} placeholder="+39 123 456 7890" /></div>
                                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Azienda (opzionale)</label><input type="text" name="azienda" value={formData.azienda} onChange={handleChange} className={inputClass} placeholder="Nome dell'azienda" /></div>
                                </div>
                            </div>
                        )}

                        {/* Step 2 — Quantità, file e messaggio */}
                        {currentStep === 2 && (
                            <div className="p-8">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4"><Package className="w-8 h-8" /></div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">La Tua Richiesta</h2>
                                    <p className="text-gray-600">Indicaci la quantità, allega un file se ce l'hai e descrivi il tuo progetto</p>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantità *</label>
                                        <input type="number" name="quantita" required min="1" value={formData.quantita} onChange={handleChange} className={inputClass} placeholder="Es. 500" />
                                    </div>

                                    <FileUploadComponent onFileChange={handleFileChange} />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Messaggio / Descrizione *</label>
                                        <textarea name="note" required value={formData.note} onChange={handleChange} rows={5} className={`${inputClass} resize-none`} placeholder="Descrivi cosa vuoi stampare: tipo di prodotto, formato, materiali, tempistiche e qualsiasi altro dettaglio utile..."></textarea>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200 space-y-4">
                                        <label className="flex items-start space-x-3">
                                            <input type="checkbox" name="privacy" required checked={formData.privacy} onChange={handleChange} className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-1" />
                                            <span className="text-sm text-gray-700">Accetto il trattamento dei dati personali secondo la{' '}<a href="/privacy" className="text-teal-600 hover:text-teal-700 underline">Privacy Policy</a> *</span>
                                        </label>
                                        <label className="flex items-start space-x-3">
                                            <input type="checkbox" name="newsletter" checked={formData.newsletter} onChange={handleChange} className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-1" />
                                            <span className="text-sm text-gray-700">Acconsento a ricevere offerte, novità e comunicazioni di marketing via email da Idealstampa.</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="px-8 py-6 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center space-x-4">
                                {currentStep > 1 && (
                                    <button type="button" onClick={prevStep} disabled={isSubmitting}
                                            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                                        <span>Indietro</span>
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center space-x-4">
                                {currentStep < 2 ? (
                                    <button type="button" onClick={nextStep}
                                            disabled={isSubmitting || (currentStep===1 && (!formData.nome||!formData.cognome||!formData.email||!formData.telefono))}
                                            className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200">
                                        <span>Continua</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                                    </button>
                                ) : (
                                    <button type="submit" disabled={!formData.privacy || !formData.quantita || !formData.note || isSubmitting}
                                            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200">
                                        {isSubmitting ? (
                                            <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Invio in corso...</span></>
                                        ) : (
                                            <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg><span>Invia Richiesta</span></>
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
