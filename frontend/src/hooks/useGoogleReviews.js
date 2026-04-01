// frontend/src/hooks/useGoogleReviews.js
// Custom hook per recuperare le recensioni Google dal backend
import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useGoogleReviews() {
    const [reviews, setReviews] = useState([]);
    const [placeInfo, setPlaceInfo] = useState({ totalRating: 5.0, totalCount: 0, placeName: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [source, setSource] = useState(null); // 'google' | 'cache' | 'fallback'

    useEffect(() => {
        let cancelled = false;

        async function fetchReviews() {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/api/reviews`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();

                if (!cancelled && json.success) {
                    setReviews(json.data.reviews || []);
                    setPlaceInfo({
                        totalRating: json.data.totalRating,
                        totalCount: json.data.totalCount,
                        placeName: json.data.placeName,
                    });
                    setSource(json.source);
                }
            } catch (err) {
                if (!cancelled) {
                    console.warn('Could not load reviews from backend:', err.message);
                    setError(err.message);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchReviews();
        return () => { cancelled = true; };
    }, []);

    return { reviews, placeInfo, loading, error, source };
}