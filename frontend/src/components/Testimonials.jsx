// frontend/src/components/Testimonials.jsx
// Sezione recensioni Google da usare nella Hero o come componente standalone
import { useState, useEffect, useRef } from 'react';
import { useGoogleReviews } from '../hooks/useGoogleReviews';

// Icona Google SVG
function GoogleIcon({ size = 20 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
    );
}

// Stelle rating
function Stars({ rating, size = 'md' }) {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} className={`${sizeClass} ${i <= rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            ))}
        </div>
    );
}

// Skeleton loader per una card
function ReviewSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow animate-pulse flex-shrink-0 w-80">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
            </div>
            <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => <div key={i} className="w-4 h-4 bg-gray-200 rounded" />)}
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
                <div className="h-3 bg-gray-100 rounded w-4/6" />
            </div>
        </div>
    );
}

// Card singola recensione
function ReviewCard({ review, isActive }) {
    const [expanded, setExpanded] = useState(false);
    const maxChars = 160;
    const needsTruncate = review.text.length > maxChars;
    const displayText = (!expanded && needsTruncate)
        ? review.text.slice(0, maxChars).trim() + '…'
        : review.text;

    // Iniziali per avatar fallback
    const initials = review.author
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    // Colore avatar deterministico
    const colors = [
        'bg-indigo-500', 'bg-purple-500', 'bg-blue-500',
        'bg-teal-500', 'bg-rose-500', 'bg-amber-500'
    ];
    const colorIdx = review.author.charCodeAt(0) % colors.length;

    return (
        <div className={`bg-white rounded-2xl p-6 shadow-lg flex-shrink-0 w-80 transition-all duration-300 
            ${isActive ? 'ring-2 ring-indigo-400 shadow-indigo-100' : 'hover:shadow-xl'}
        `}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    {review.profilePhoto ? (
                        <img
                            src={review.profilePhoto}
                            alt={review.author}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                    ) : null}
                    <div
                        className={`w-10 h-10 rounded-full ${colors[colorIdx]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                        style={{ display: review.profilePhoto ? 'none' : 'flex' }}
                    >
                        {initials}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{review.author}</p>
                        {review.relativeTime && (
                            <p className="text-gray-400 text-xs">{review.relativeTime}</p>
                        )}
                    </div>
                </div>
                <GoogleIcon size={18} />
            </div>

            {/* Stars */}
            <Stars rating={review.rating} size="sm" />

            {/* Text */}
            {review.text && (
                <div className="mt-3">
                    <p className="text-gray-600 text-sm leading-relaxed">{displayText}</p>
                    {needsTruncate && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-indigo-500 text-xs font-medium mt-1 hover:text-indigo-700 transition-colors"
                        >
                            {expanded ? 'Mostra meno' : 'Leggi tutto'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default function Testimonials({ isVisible }) {
    const { reviews, placeInfo, loading } = useGoogleReviews();
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const trackRef = useRef(null);

    // Auto-avanza il carosello
    useEffect(() => {
        if (reviews.length === 0 || isPaused) return;
        const interval = setInterval(() => {
            setCurrent(prev => (prev + 1) % reviews.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [reviews.length, isPaused]);

    // Scroll il track alla card attiva (solo orizzontale, senza toccare la pagina)
    useEffect(() => {
        if (!trackRef.current || reviews.length === 0) return;
        const card = trackRef.current.children[current];
        if (card) {
            const containerLeft = trackRef.current.getBoundingClientRect().left;
            const cardLeft = card.getBoundingClientRect().left;
            const offset = cardLeft - containerLeft - (trackRef.current.offsetWidth / 2) + (card.offsetWidth / 2);
            trackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    }, [current, reviews.length]);

    const renderRatingInt = Math.round(placeInfo.totalRating);

    return (
        <section
            id="testimonials"
            data-animate
            className={`py-20 bg-gradient-to-br from-indigo-50 to-blue-50 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow text-sm font-medium text-gray-600 mb-5">
                        <GoogleIcon size={16} />
                        Recensioni Google verificate
                    </div>

                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Cosa Dicono di Noi
                    </h2>
                    <p className="text-xl text-gray-600 mb-6">
                        La soddisfazione dei nostri clienti è la nostra priorità
                    </p>

                    {/* Rating badge */}
                    {!loading && (
                        <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-6 py-4 shadow-lg">
                            <div className="text-center">
                                <p className="text-4xl font-bold text-gray-900">{placeInfo.totalRating.toFixed(1)}</p>
                                <Stars rating={renderRatingInt} />
                                <p className="text-xs text-gray-400 mt-1">{placeInfo.totalCount > 0 ? `${placeInfo.totalCount} recensioni` : 'Clienti soddisfatti'}</p>
                            </div>
                            <div className="w-px h-12 bg-gray-200" />
                            <div className="flex items-center gap-2">
                                <GoogleIcon size={28} />
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-gray-800">Google Business</p>
                                    <p className="text-xs text-gray-400">Tipografia Idealstampa</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Cards track */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Gradients fade laterali */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-indigo-50 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-blue-50 to-transparent z-10 pointer-events-none" />

                    {/* Frecce navigazione */}
                    <button
                        onClick={() => setCurrent(prev => (prev - 1 + Math.max(reviews.length, 1)) % Math.max(reviews.length, 1))}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow-lg p-2 hover:shadow-xl transition-all"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setCurrent(prev => (prev + 1) % Math.max(reviews.length, 1))}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow-lg p-2 hover:shadow-xl transition-all"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Scroll track */}
                    <div
                        ref={trackRef}
                        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth px-8 py-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {loading
                            ? Array.from({ length: 3 }).map((_, i) => <ReviewSkeleton key={i} />)
                            : reviews.map((review, idx) => (
                                <ReviewCard
                                    key={idx}
                                    review={review}
                                    isActive={idx === current}
                                />
                            ))
                        }
                    </div>
                </div>

                {/* Dots */}
                {!loading && reviews.length > 0 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {reviews.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className={`rounded-full transition-all duration-300 ${
                                    idx === current
                                        ? 'w-6 h-3 bg-indigo-600'
                                        : 'w-3 h-3 bg-gray-300 hover:bg-indigo-300'
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* CTA Google */}
                <div className="text-center mt-10">
                    <a
                        href={`https://search.google.com/local/reviews?placeid=${import.meta.env.VITE_GOOGLE_PLACE_ID || ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium hover:shadow-md transition-all text-sm"
                    >
                        <GoogleIcon size={16} />
                        Leggi tutte le recensioni su Google
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>

            </div>
        </section>
    );
}