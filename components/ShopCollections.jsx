"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ShopCollections = () => {
  const collections = [
    {
      id: 'get-it-tomorrow',
      label: 'Get it Tomorrow',
      icon: 'fas fa-truck-fast',
      image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=400&h=400&fit=crop',
      href: '/plantshop?delivery=express',
      color: '#FF6B9D'
    },
    {
      id: 'bestsellers',
      label: 'Bestsellers',
      icon: 'fas fa-star',
      image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&h=400&fit=crop',
      href: '/plantshop?filter=bestseller',
      color: '#F39C12'
    },
    {
      id: 'xl-plants',
      label: 'XL plants',
      icon: 'fas fa-seedling',
      image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&h=400&fit=crop',
      href: '/plantshop?size=xl',
      color: '#27AE60'
    },
    {
      id: 'easy-care',
      label: 'Easy To Care',
      icon: 'fas fa-heart',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
      href: '/plantshop?care=easy',
      color: '#E74C3C'
    },
    {
      id: 'plant-care',
      label: 'Plant Care',
      icon: 'fas fa-hand-holding-droplet',
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=400&fit=crop',
      href: '/plantshop?category=care-products',
      color: '#3498DB'
    },
    {
      id: 'seeds',
      label: 'Seeds',
      icon: 'fas fa-leaf',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=400&fit=crop',
      href: '/plantshop?category=seeds',
      color: '#9B59B6'
    },
    {
      id: 'fertilizers',
      label: 'Fertilizers',
      icon: 'fas fa-flask',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
      href: '/plantshop?category=fertilizers',
      color: '#16A085'
    }
  ];

  return (
    <div className="shop-collections">
      <div className="container">
        <div className="collections-scroll-wrapper">
          <div className="collections-grid">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={collection.href} className="collection-card">
                  <div
                    className="collection-image-wrapper"
                    style={{ '--collection-color': collection.color }}
                  >
                    <div className="collection-image">
                      <img src={collection.image} alt={collection.label} />
                    </div>
                  </div>
                  <span className="collection-label">{collection.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCollections;
