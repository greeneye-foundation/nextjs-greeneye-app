"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";

const BlogIndex = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const scrollRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs`)
      .then((res) => { setBlogs(res.data.blogs || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amt = 360;
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft + (dir === 'left' ? -amt : amt),
      behavior: 'smooth'
    });
  };

  const publishedBlogs = blogs.filter((b) => b.published);

  if (loading || publishedBlogs.length === 0) return null;

  return (
    <section className="ge-blog ge-section ge-section-alt">
      <div className="ge-container">
        <div className="ge-blog__header">
          <div>
            <span className="ge-overline">From Our Blog</span>
            <h2>Stories & Updates</h2>
          </div>
          <Link href="/blog" className="ge-blog__view-all">
            View All <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div className="ge-blog__carousel-wrap">
          <button className="ge-blog__arrow ge-blog__arrow--left" onClick={() => scroll('left')} aria-label="Scroll left">
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className="ge-blog__carousel" ref={scrollRef}>
            {publishedBlogs.map((b) => {
              const tr = b.translations?.[locale] || b.translations?.en || {};
              return (
                <Link key={b.slug} href={`/blog/${b.slug}`} className="ge-blog__card">
                  {b.image && (
                    <div className="ge-blog__card-img">
                      <Image src={b.image} alt={tr.title || "Blog"} fill style={{ objectFit: 'cover' }} />
                    </div>
                  )}
                  <div className="ge-blog__card-body">
                    <h3>{tr.title || "Untitled"}</h3>
                    <p className="ge-blog__card-excerpt">
                      {(tr.content || "").substring(0, 120)}...
                    </p>
                    <div className="ge-blog__card-meta">
                      <span>{new Date(b.createdAt).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      <span>{b.author || "GreenEye"}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <button className="ge-blog__arrow ge-blog__arrow--right" onClick={() => scroll('right')} aria-label="Scroll right">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogIndex;
