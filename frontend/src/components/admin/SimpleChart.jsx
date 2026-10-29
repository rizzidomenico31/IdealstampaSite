import { useMemo } from 'react';

/**
 * Grafico SVG leggero per trend giornalieri.
 * data: [{ label, value, secondary? }]
 */
export default function SimpleChart({ data, primaryColor = '#0d9488', secondaryColor = '#84cc16', height = 200 }) {
    const padding = { top: 10, right: 10, bottom: 30, left: 40 };
    const width = 600;
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const { primary, secondary, max, labels } = useMemo(() => {
        const primary = data.map(d => d.value || 0);
        const secondary = data.map(d => d.secondary || 0);
        const max = Math.max(1, ...primary, ...secondary);
        return { primary, secondary, max, labels: data.map(d => d.label) };
    }, [data]);

    if (!data.length) return <div className="text-sm text-slate-400">Nessun dato da visualizzare</div>;

    const stepX = data.length > 1 ? chartW / (data.length - 1) : chartW;

    const points = (series) => series.map((v, i) => {
        const x = padding.left + i * stepX;
        const y = padding.top + chartH - (v / max) * chartH;
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = (series) => {
        const base = `${padding.left},${padding.top + chartH} ` +
            series.map((v, i) => {
                const x = padding.left + i * stepX;
                const y = padding.top + chartH - (v / max) * chartH;
                return `${x},${y}`;
            }).join(' ') +
            ` ${padding.left + chartW},${padding.top + chartH}`;
        return base;
    };

    const yTicks = [0, max / 2, max];

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
            {/* Griglia Y */}
            {yTicks.map((t, i) => {
                const y = padding.top + chartH - (t / max) * chartH;
                return (
                    <g key={i}>
                        <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                        <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">
                            {Math.round(t)}
                        </text>
                    </g>
                );
            })}

            {/* Aree */}
            <polygon points={areaPoints(primary)} fill={primaryColor} fillOpacity="0.10" />
            <polygon points={areaPoints(secondary)} fill={secondaryColor} fillOpacity="0.08" />

            {/* Linee */}
            <polyline points={points(primary)} fill="none" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={points(secondary)} fill="none" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" />

            {/* Labels X */}
            {labels.map((l, i) => {
                if (data.length > 14 && i % 2 !== 0) return null;
                const x = padding.left + i * stepX;
                return (
                    <text key={i} x={x} y={height - 8} textAnchor="middle" fontSize="9" fill="#64748b">
                        {l}
                    </text>
                );
            })}
        </svg>
    );
}
