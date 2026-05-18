/**
 * BodyWithOrbs V3.3, pure image swap.
 * Hero "all": 4 orb active (gola, petto, plesso solare, pancia) — aggiornato
 * 2026-05-17 dopo call Aldo (no più 6 archetipi geo-localizzati).
 * Le 6 immagini sequence single-state restano disponibili come archivio ma non
 * sono più usate dal flow del quiz (la result page non mostra più body+orb).
 */

export type OrbActiveState = number | "all" | null;

const SEQUENCE = [
  { src: "/body-sequence/01-misurare.png",     label: "Fronte"        },
  { src: "/body-sequence/02-attivare.png",     label: "Gola"          },
  { src: "/body-sequence/03-giocare.png",      label: "Cuore"         },
  { src: "/body-sequence/04-rilasciare.png",   label: "Plesso solare" },
  { src: "/body-sequence/05-insistere.png",    label: "Pancia"        },
  { src: "/body-sequence/06-neutralizzare.png",label: "Bacino"        },
];

const ALL_SRC = "/body-all.png";

type Props = {
  activeOrb?: OrbActiveState;
  className?: string;
  imageClassName?: string;
  showLabels?: boolean;
};

export default function BodyWithOrbs({
  activeOrb = "all",
  className = "",
  imageClassName = "",
  showLabels = false,
}: Props) {
  const activeIdx = typeof activeOrb === "number" ? activeOrb : null;

  return (
    <div className={`relative ${className}`}>
      {/* Stack, tutte le immagini caricate, opacity controlla la visibile.
          Garantisce zero flash al cambio + smooth crossfade. */}

      {/* "all" state base layer */}
      <picture
        className="block"
        style={{ opacity: activeOrb === "all" ? 1 : 0, transition: "opacity 700ms" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ALL_SRC}
          alt="Figura Vitruviana wireframe, quattro punti energetici attivi sulla linea mediana"
          width={1024}
          height={1024}
          className={`block w-full h-auto select-none ${imageClassName}`}
          loading="eager"
          fetchPriority="high"
          draggable={false}
        />
      </picture>

      {/* Single-orb states stack */}
      {SEQUENCE.map((s, i) => (
        <picture
          key={s.src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: activeIdx === i ? 1 : 0 }}
          aria-hidden={activeIdx !== i}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.src}
            alt={activeIdx === i ? `Figura Vitruviana, ${s.label} attivo` : ""}
            width={1024}
            height={1024}
            className={`block w-full h-auto select-none ${imageClassName}`}
            loading={i < 2 ? "eager" : "lazy"}
            draggable={false}
          />
        </picture>
      ))}

      {/* Optional active label */}
      {showLabels && activeIdx !== null && SEQUENCE[activeIdx] && (
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <span className="utility-text text-[0.6875rem] tracking-[0.3em] text-[var(--accent)] uppercase">
            {SEQUENCE[activeIdx].label}
          </span>
        </div>
      )}
    </div>
  );
}

export { SEQUENCE };
