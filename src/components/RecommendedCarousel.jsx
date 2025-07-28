import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function RecommendedCarousel({ shows }) {
  const [start, setStart] = useState(0);
  const maxVisible = 4;
  const cardWidth = 280; // px
  const gap = 24; // px
  const totalShows = shows.length;
  const maxStart = Math.max(0, totalShows - maxVisible);

  // For smooth sliding, we render all shows in a row and shift the row
  const canScrollLeft = start > 0;
  const canScrollRight = start < maxStart;

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        left: 0,
        right: 0,
        margin: 0,
        background: '#f5f5f5',
        padding: '2rem 0 2rem 0',
        boxSizing: 'border-box',
        zIndex: 1,
      }}
    >
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 32px 8px 32px' }}>
          <h2 style={{ textAlign: 'left', margin: 0, fontWeight: 700, fontSize: 26 }}>Recommended Shows</h2>
          <div>
            <button
              onClick={() => setStart(start - 1)}
              disabled={!canScrollLeft}
              style={{ fontSize: 24, marginRight: 8, opacity: canScrollLeft ? 1 : 0.3, border: 'none', background: 'none', cursor: 'pointer' }}
              aria-label="Scroll left"
            >
              ◀
            </button>
            <button
              onClick={() => setStart(start + 1)}
              disabled={!canScrollRight}
              style={{ fontSize: 24, opacity: canScrollRight ? 1 : 0.3, border: 'none', background: 'none', cursor: 'pointer' }}
              aria-label="Scroll right"
            >
              ▶
            </button>
          </div>
        </div>
        <div
          style={{
            overflow: 'hidden',
            width: '100vw',
            margin: '0 auto',
            boxSizing: 'border-box',
            position: 'relative',
            height: 340,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: `${gap}px`,
              transform: `translateX(-${start * (cardWidth + gap)}px)`,
              transition: 'transform 0.5s cubic-bezier(.77,0,.18,1)',
              willChange: 'transform',
              height: '100%',
            }}
          >
            {shows.map((show) => (
              <Link
                key={show.id}
                to={`/show/${show.id}`}
                style={{
                  width: cardWidth,
                  minWidth: cardWidth,
                  maxWidth: cardWidth,
                  border: '1px solid #ccc',
                  borderRadius: 16,
                  padding: 20,
                  background: '#fafafa',
                  textDecoration: 'none',
                  color: '#222',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'box-shadow 0.2s',
                  margin: 0,
                }}
              >
                <img src={show.image} alt={show.title} style={{ width: '70%', height: 140, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
                <div style={{ fontWeight: 700, fontSize: 18, margin: '10px 0 6px 0', textAlign: 'center' }}>{show.title}</div>
                {show.genres && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 10 }}>
                    {show.genres.map((genre, idx) => (
                      <span key={idx} style={{ fontSize: 14, background: '#eee', borderRadius: 7, padding: '4px 10px' }}>{genre}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
