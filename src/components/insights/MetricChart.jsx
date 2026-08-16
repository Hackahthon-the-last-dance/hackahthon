// Responsive SVG Health Metric Chart with Tooltip and Trend Visualizations
import React, { useState } from 'react';

export default function MetricChart({
  title,
  subtitle,
  data = [],
  metricKey = 'value',
  unit = '',
  color = 'var(--primary)',
  targetLine = null,
  targetLabel = 'Goal',
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) return null;

  const width = 500;
  const height = 180;
  const padding = 36;

  const values = data.map((d) => d[metricKey] || 0);
  const maxVal = Math.max(...values, targetLine || 1, 10);
  const minVal = 0;

  // Calculate points for SVG path
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d[metricKey] || 0) - minVal) / (maxVal - minVal) * (height - padding * 2);
    return { x, y, data: d, val: d[metricKey] };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  const targetY = targetLine
    ? height - padding - (targetLine - minVal) / (maxVal - minVal) * (height - padding * 2)
    : null;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
      className="card-hoverable"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {title}
          </h4>
          {subtitle && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>

        {targetLine && (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Target: {targetLine} {unit}
          </span>
        )}
      </div>

      {/* SVG Canvas */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          <defs>
            <linearGradient id={`grad-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Target Goal Horizontal Dashed Line */}
          {targetY !== null && (
            <>
              <line
                x1={padding}
                y1={targetY}
                x2={width - padding}
                y2={targetY}
                stroke="var(--text-muted)"
                strokeDasharray="4 4"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <text
                x={width - padding + 4}
                y={targetY + 4}
                fill="var(--text-muted)"
                fontSize="10"
                fontFamily="var(--font-sans)"
              >
                {targetLabel}
              </text>
            </>
          )}

          {/* Filled Area Gradient */}
          <path d={areaD} fill={`url(#grad-${metricKey})`} />

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Point Circles */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill={color}
                  stroke="var(--bg-surface)"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Day label below */}
                <text
                  x={pt.x}
                  y={height - 12}
                  textAnchor="middle"
                  fill={isHovered ? 'var(--primary)' : 'var(--text-muted)'}
                  fontSize="11"
                  fontWeight={isHovered ? '700' : '500'}
                  fontFamily="var(--font-sans)"
                >
                  {pt.data.dayShort || `D${i + 1}`}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: `${(hoveredIndex / (data.length - 1)) * 80 + 10}%`,
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 10px',
              boxShadow: 'var(--shadow-lg)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
            className="animate-scale-in"
          >
            <p style={{ fontSize: '0.75rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              {points[hoveredIndex].data.dayName || points[hoveredIndex].data.dayShort}
            </p>
            <p style={{ fontSize: '0.8125rem', color, fontWeight: 800, margin: '2px 0 0' }}>
              {points[hoveredIndex].val} {unit}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
