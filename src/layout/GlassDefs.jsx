// Hidden SVG filter that distorts the backdrop behind glass buttons.
// Rendered once at the app root and referenced by .btn::after via filter: url(#glass-distortion).
function GlassDefs() {
  return (
    <svg aria-hidden="true" focusable="false" className="svg-defs">
      <filter
        id="glass-distortion"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012 0.012"
          numOctaves="3"
          seed="7"
          result="noise"
        />
        <feGaussianBlur in="noise" stdDeviation="3.5" result="softMap" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softMap"
          scale="28"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}

export default GlassDefs;
