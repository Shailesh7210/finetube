'use client';

import React from 'react';

interface HeroTopicAnimationProps {
  topicId: string;
}

export function HeroTopicAnimation({ topicId }: HeroTopicAnimationProps) {
  if (topicId === 'science') {
    // Physics: Electrostatics & Gauss's Law Gaussian Surface + Electric Field Lines
    const angles = [0, 45, 90, 135, 180, 225, 270, 315];

    return (
      <svg
        viewBox="0 0 480 270"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="chargeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </radialGradient>
          <marker
            id="fieldArrow"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4F46E5" />
          </marker>
        </defs>

        {/* Subtle Physics Coordinate Grid */}
        <g stroke="#E2E8F0" strokeWidth="1" opacity="0.7">
          <line x1="240" y1="12" x2="240" y2="258" strokeDasharray="3 4" />
          <line x1="40" y1="135" x2="440" y2="135" strokeDasharray="3 4" />
        </g>

        {/* Gaussian Surface Sphere (Dashed Radius r) */}
        <circle
          cx="240"
          cy="135"
          r="78"
          fill="#EEF2FF"
          fillOpacity="0.45"
          stroke="#6366F1"
          strokeWidth="1.75"
          strokeDasharray="6 5"
        />
        <text
          x="324"
          y="78"
          fill="#4F46E5"
          fontSize="10"
          fontWeight="600"
          fontFamily="monospace"
        >
          Gaussian Surface (r)
        </text>

        {/* Radial Electric Field Vectors */}
        {angles.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 240 + Math.cos(rad) * 26;
          const y1 = 135 + Math.sin(rad) * 26;
          const x2 = 240 + Math.cos(rad) * 112;
          const y2 = 135 + Math.sin(rad) * 112;
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#4F46E5"
              strokeWidth="1.8"
              strokeDasharray="6 4"
              markerEnd="url(#fieldArrow)"
              className="animate-dash-flow"
            />
          );
        })}

        {/* Orbiting Test Charge +q */}
        <g className="animate-orbit-slow">
          <circle cx="318" cy="135" r="8" fill="#0EA5E9" stroke="#FFFFFF" strokeWidth="2" />
          <text
            x="318"
            y="138"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="9"
            fontWeight="bold"
          >
            +q
          </text>
        </g>

        {/* Central Point Charge +Q */}
        <circle cx="240" cy="135" r="46" fill="url(#chargeGlow)" className="animate-heartbeat" />
        <circle
          cx="240"
          cy="135"
          r="19"
          fill="#4F46E5"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          className="animate-heartbeat"
        />
        <text
          x="240"
          y="140"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="13"
          fontWeight="700"
          fontFamily="monospace"
        >
          +Q
        </text>

        {/* Live Vector Label */}
        <g transform="translate(26, 214)">
          <rect width="142" height="32" rx="10" fill="#FFFFFF" stroke="#CBD5E1" />
          <text x="12" y="20" fill="#334155" fontSize="11" fontWeight="600" fontFamily="monospace">
            E⃗ = k·Q / r² r̂
          </text>
        </g>
      </svg>
    );
  }

  if (topicId === 'medicine') {
    // Medical: Live Cardiac ECG P-QRS-T Waveform + Beating Heart Pulse
    return (
      <svg
        viewBox="0 0 480 270"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Clinical ECG Grid */}
        <g stroke="#F1F5F9" strokeWidth="1">
          {[40, 80, 120, 160, 200, 240].map((y) => (
            <line key={`h-${y}`} x1="20" y1={y} x2="460" y2={y} />
          ))}
          {[60, 120, 180, 240, 300, 360, 420].map((x) => (
            <line key={`v-${x}`} x1={x} y1="25" x2={x} y2="245" />
          ))}
        </g>

        {/* Stylised Beating Heart Emblem on Left */}
        <g transform="translate(88, 130)">
          <circle cx="0" cy="0" r="44" fill="#FFE4E6" fillOpacity="0.65" className="animate-heartbeat" />
          <path
            d="M0 24 C-22 10 -30 -8 -20 -20 C-12 -28 0 -22 0 -13 C0 -22 12 -28 20 -20 C30 -8 22 10 0 24 Z"
            fill="#E11D48"
            className="animate-heartbeat"
          />
          <text
            x="0"
            y="46"
            textAnchor="middle"
            fill="#9F1239"
            fontSize="11"
            fontWeight="700"
            fontFamily="monospace"
          >
            72 BPM · SA NODE
          </text>
        </g>

        {/* Baseline Subtle Trace */}
        <path
          d="M156 142 L205 142 L214 132 L224 142 L235 142 L242 156 L252 84 L264 176 L274 142 L292 142 C302 126 314 126 322 142 L365 142 L374 132 L384 142 L394 142 L401 156 L411 86 L422 174 L432 142 L456 142"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Animated Active P-QRS-T Sweep */}
        <path
          d="M156 142 L205 142 L214 132 L224 142 L235 142 L242 156 L252 84 L264 176 L274 142 L292 142 C302 126 314 126 322 142 L365 142 L374 132 L384 142 L394 142 L401 156 L411 86 L422 174 L432 142 L456 142"
          fill="none"
          stroke="#10B981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-ecg-trace"
        />

        {/* Annotations */}
        <text x="214" y="122" textAnchor="middle" fill="#0F766E" fontSize="10" fontWeight="700">P</text>
        <text x="252" y="72" textAnchor="middle" fill="#0F766E" fontSize="10" fontWeight="700">QRS</text>
        <text x="308" y="118" textAnchor="middle" fill="#0F766E" fontSize="10" fontWeight="700">T</text>

        {/* Telemetry Readout */}
        <g transform="translate(160, 206)">
          <rect width="290" height="32" rx="10" fill="#FFFFFF" stroke="#CBD5E1" />
          <text x="14" y="20" fill="#0F172A" fontSize="11" fontWeight="600" fontFamily="monospace">
            Stroke Vol: 70 mL · CO = 5.04 L/min
          </text>
        </g>
      </svg>
    );
  }

  if (topicId === 'history') {
    // History: 1789 French Revolution Animated Chronological Progression
    const milestones = [
      { x: 96, y: 152, date: 'MAY 1789', title: 'Estates-General' },
      { x: 240, y: 108, date: 'JUL 14, 1789', title: 'Bastille' },
      { x: 384, y: 146, date: 'AUG 1789', title: 'Rights of Man' }
    ];

    return (
      <svg
        viewBox="0 0 480 270"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle Architectural Grid */}
        <line x1="40" y1="210" x2="440" y2="210" stroke="#CBD5E1" strokeWidth="1.5" />
        {[96, 240, 384].map((x) => (
          <line key={x} x1={x} y1="205" x2={x} y2="215" stroke="#94A3B8" strokeWidth="2" />
        ))}

        {/* Static Path Underneath */}
        <path
          d="M 96 152 Q 168 95 240 108 T 384 146"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Animated Chronological Dash Sweep */}
        <path
          d="M 96 152 Q 168 95 240 108 T 384 146"
          fill="none"
          stroke="#D97706"
          strokeWidth="3"
          strokeDasharray="8 6"
          strokeLinecap="round"
          className="animate-dash-flow"
        />

        {milestones.map((m, i) => (
          <g key={m.date} transform={`translate(${m.x}, ${m.y})`}>
            <circle
              cx="0"
              cy="0"
              r="22"
              fill="#FEF3C7"
              fillOpacity="0.8"
              className="animate-heartbeat"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
            <circle cx="0" cy="0" r="10" fill="#D97706" stroke="#FFFFFF" strokeWidth="2.5" />

            <rect
              x="-58"
              y="-56"
              width="116"
              height="38"
              rx="10"
              fill="#FFFFFF"
              stroke="#E2E8F0"
            />
            <text
              x="0"
              y="-40"
              textAnchor="middle"
              fill="#B45309"
              fontSize="9.5"
              fontWeight="700"
              fontFamily="monospace"
            >
              {m.date}
            </text>
            <text
              x="0"
              y="-26"
              textAnchor="middle"
              fill="#0F172A"
              fontSize="11"
              fontWeight="700"
            >
              {m.title}
            </text>
          </g>
        ))}

        <text
          x="240"
          y="236"
          textAnchor="middle"
          fill="#64748B"
          fontSize="11"
          fontWeight="600"
          fontFamily="monospace"
        >
          Ancien Régime → Constitutional Republic
        </text>
      </svg>
    );
  }

  // Code: React Lifecycle & State Synchronization Animated Flow Diagram
  return (
    <svg
      viewBox="0 0 480 270"
      className="w-full h-full select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="codeArrow"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0284C7" />
        </marker>
      </defs>

      {/* Connecting Animated Flows */}
      <path
        d="M 140 96 L 200 96"
        fill="none"
        stroke="#0284C7"
        strokeWidth="2.5"
        strokeDasharray="6 4"
        markerEnd="url(#codeArrow)"
        className="animate-dash-flow"
      />
      <path
        d="M 295 96 L 350 96"
        fill="none"
        stroke="#0284C7"
        strokeWidth="2.5"
        strokeDasharray="6 4"
        markerEnd="url(#codeArrow)"
        className="animate-dash-flow"
      />
      <path
        d="M 395 124 C 395 185 88 185 88 124"
        fill="none"
        stroke="#10B981"
        strokeWidth="2.2"
        strokeDasharray="6 4"
        markerEnd="url(#codeArrow)"
        className="animate-dash-flow"
      />

      {/* Node 1: Render */}
      <g transform="translate(36, 68)">
        <rect width="102" height="54" rx="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="51" y="25" textAnchor="middle" fill="#64748B" fontSize="9.5" fontWeight="700" fontFamily="monospace">
          STEP 1
        </text>
        <text x="51" y="42" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="700">
          Render UI
        </text>
      </g>

      {/* Node 2: Commit */}
      <g transform="translate(202, 68)">
        <rect width="92" height="54" rx="14" fill="#E0F2FE" stroke="#7DD3FC" strokeWidth="1.5" />
        <text x="46" y="25" textAnchor="middle" fill="#0369A1" fontSize="9.5" fontWeight="700" fontFamily="monospace">
          STEP 2
        </text>
        <text x="46" y="42" textAnchor="middle" fill="#0C4A6E" fontSize="12" fontWeight="700">
          DOM Sync
        </text>
      </g>

      {/* Node 3: Effect */}
      <g transform="translate(352, 68)">
        <rect
          width="96"
          height="54"
          rx="14"
          fill="#4F46E5"
          className="animate-heartbeat"
        />
        <text x="48" y="25" textAnchor="middle" fill="#C7D2FE" fontSize="9.5" fontWeight="700" fontFamily="monospace">
          STEP 3
        </text>
        <text x="48" y="42" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="700">
          useEffect()
        </text>
      </g>

      {/* Cleanup Loop Pill */}
      <g transform="translate(158, 178)">
        <rect width="166" height="32" rx="12" fill="#ECFDF5" stroke="#A7F3D0" />
        <text x="83" y="20" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="700" fontFamily="monospace">
          return () =&gt; cleanup()
        </text>
      </g>
    </svg>
  );
}
