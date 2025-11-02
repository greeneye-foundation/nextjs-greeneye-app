"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function InstagramFeed() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/instagram`)
      .then((r) => r.json())
      .then((d) => {
        setItems(Array.isArray(d.items) ? d.items : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load Instagram feed");
        setLoading(false);
      });
  }, []);

  // scroll function
  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollTo =
      dir === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
    scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
  };

  // ✅ Auto scroll every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth) {
          // reset to start
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scroll("right");
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="ig-section">
        <div className="ig-loading">Loading Instagram…</div>
      </section>
    );
  }
  if (error || !items.length) return null;

  return (
    <section className="ig-section">
      <h2 className="ig-heading">From Instagram</h2>

      <div className="ig-wrapper">
        {/* Left button */}
        <button onClick={() => scroll("left")} className="ig-btn left">
          <ChevronLeft size={20} />
        </button>

        {/* Right button */}
        <button onClick={() => scroll("right")} className="ig-btn right">
          <ChevronRight size={20} />
        </button>

        {/* Horizontal Cards */}
        <div ref={scrollRef} className="ig-feed">
          {items.map((m) => {
            const isVideo =
              m.media_type === "VIDEO" || m.media_product_type === "REELS";
            const isCarousel = m.media_type === "CAROUSEL_ALBUM";
            const cover =
              isCarousel && m.children?.data?.length
                ? m.children.data[0].media_url
                : m.media_url;

            return (
              <motion.a
                key={m.id}
                href={m.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="ig-card"
                whileHover={{ scale: 1.02 }}
              >
                {/* Media Section */}
                <div className="ig-media">
                  {isVideo ? (
                    <video
                      src={m.media_url}
                      poster={m.thumbnail_url || undefined}
                      playsInline
                      muted
                      loop
                      preload="metadata"
                      className="ig-video"
                    />
                  ) : (
                    <img
                      src={cover}
                      alt={m.caption?.slice(0, 80) || "Instagram"}
                      className="ig-img"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Caption Section */}
                <div className="ig-caption">
                  <p>{m.caption || "Instagram Post"}</p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
