"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const ShopSubmenu = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const closeTimeoutRef = useRef(null);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const menuItems = [
    {
      id: 'plants',
      label: 'Plants',
      megaMenu: {
        sections: [
          {
            title: 'By Type',
            links: [
              { label: 'Indoor Plants', href: '/plantshop?category=indoor' },
              { label: 'Outdoor Plants', href: '/plantshop?category=outdoor' },
              { label: 'Succulents', href: '/plantshop?category=succulents' },
              { label: 'Flowering Plants', href: '/plantshop?category=flowering' },
              { label: 'Air Purifying', href: '/plantshop?category=air-purifying' },
            ]
          },
          {
            title: 'By Size',
            links: [
              { label: 'Small Plants', href: '/plantshop?size=small' },
              { label: 'Medium Plants', href: '/plantshop?size=medium' },
              { label: 'Large Plants', href: '/plantshop?size=large' },
              { label: 'XL Plants', href: '/plantshop?size=xl' },
            ]
          },
          {
            title: 'By Care',
            links: [
              { label: 'Easy Care', href: '/plantshop?care=easy' },
              { label: 'Low Light', href: '/plantshop?care=low-light' },
              { label: 'Pet Friendly', href: '/plantshop?care=pet-friendly' },
              { label: 'Beginner Friendly', href: '/plantshop?care=beginner' },
            ]
          },
          {
            title: 'Popular',
            links: [
              { label: 'Bestsellers', href: '/plantshop?filter=bestseller' },
              { label: 'New Arrivals', href: '/plantshop?filter=new' },
              { label: 'On Sale', href: '/plantshop?filter=sale' },
            ]
          }
        ]
      }
    },
    {
      id: 'planters',
      label: 'Planters & Pots',
      megaMenu: {
        sections: [
          {
            title: 'By Material',
            links: [
              { label: 'Ceramic Pots', href: '/plantshop?type=ceramic' },
              { label: 'Plastic Pots', href: '/plantshop?type=plastic' },
              { label: 'Metal Planters', href: '/plantshop?type=metal' },
              { label: 'Terracotta', href: '/plantshop?type=terracotta' },
            ]
          },
          {
            title: 'By Style',
            links: [
              { label: 'Modern', href: '/plantshop?style=modern' },
              { label: 'Traditional', href: '/plantshop?style=traditional' },
              { label: 'Hanging Planters', href: '/plantshop?style=hanging' },
              { label: 'Wall Planters', href: '/plantshop?style=wall' },
            ]
          },
          {
            title: 'By Size',
            links: [
              { label: 'Small Pots', href: '/plantshop?pot-size=small' },
              { label: 'Medium Pots', href: '/plantshop?pot-size=medium' },
              { label: 'Large Pots', href: '/plantshop?pot-size=large' },
            ]
          }
        ]
      }
    },
    {
      id: 'care',
      label: 'Plant Care',
      megaMenu: {
        sections: [
          {
            title: 'Fertilizers',
            links: [
              { label: 'Organic Fertilizers', href: '/plantshop?product=organic-fertilizer' },
              { label: 'Liquid Fertilizers', href: '/plantshop?product=liquid-fertilizer' },
              { label: 'Compost', href: '/plantshop?product=compost' },
            ]
          },
          {
            title: 'Soil & Mulch',
            links: [
              { label: 'Potting Mix', href: '/plantshop?product=potting-mix' },
              { label: 'Cactus Soil', href: '/plantshop?product=cactus-soil' },
              { label: 'Orchid Mix', href: '/plantshop?product=orchid-mix' },
            ]
          },
          {
            title: 'Tools',
            links: [
              { label: 'Watering Cans', href: '/plantshop?product=watering-can' },
              { label: 'Pruning Tools', href: '/plantshop?product=pruning' },
              { label: 'Gardening Gloves', href: '/plantshop?product=gloves' },
            ]
          }
        ]
      }
    },
    {
      id: 'seeds',
      label: 'Seeds',
      megaMenu: {
        sections: [
          {
            title: 'Vegetable Seeds',
            links: [
              { label: 'Tomato Seeds', href: '/plantshop?seed=tomato' },
              { label: 'Pepper Seeds', href: '/plantshop?seed=pepper' },
              { label: 'Herbs Seeds', href: '/plantshop?seed=herbs' },
            ]
          },
          {
            title: 'Flower Seeds',
            links: [
              { label: 'Sunflower Seeds', href: '/plantshop?seed=sunflower' },
              { label: 'Marigold Seeds', href: '/plantshop?seed=marigold' },
              { label: 'Rose Seeds', href: '/plantshop?seed=rose' },
            ]
          },
          {
            title: 'Fruit Seeds',
            links: [
              { label: 'Strawberry Seeds', href: '/plantshop?seed=strawberry' },
              { label: 'Lemon Seeds', href: '/plantshop?seed=lemon' },
            ]
          }
        ]
      }
    },
    {
      id: 'gifts',
      label: 'Gifts',
      megaMenu: {
        sections: [
          {
            title: 'Gift Sets',
            links: [
              { label: 'Plant Gift Boxes', href: '/plantshop?gift=gift-box' },
              { label: 'Starter Kits', href: '/plantshop?gift=starter-kit' },
              { label: 'Care Packages', href: '/plantshop?gift=care-package' },
            ]
          },
          {
            title: 'By Occasion',
            links: [
              { label: 'Birthday Gifts', href: '/plantshop?occasion=birthday' },
              { label: 'Anniversary Gifts', href: '/plantshop?occasion=anniversary' },
              { label: 'Corporate Gifts', href: '/plantshop?occasion=corporate' },
            ]
          }
        ]
      }
    }
  ];

  const handleButtonEnter = (itemId) => {
    console.log('Button enter:', itemId, 'Current active:', activeMenu);
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    // Immediately switch to the new menu
    setActiveMenu(itemId);
  };

  const handleButtonLeave = () => {
    console.log('Button leave, current active:', activeMenu);
    // Set a short timeout - if user moves to another button or mega menu, it will be cleared
    closeTimeoutRef.current = setTimeout(() => {
      console.log('Button leave timeout executed, closing menu');
      setActiveMenu(null);
      closeTimeoutRef.current = null;
    }, 200);
  };

  const handleMegaMenuEnter = (itemId) => {
    console.log('Mega menu enter:', itemId);
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleMegaMenuLeave = () => {
    console.log('Mega menu leave, current active:', activeMenu);
    // Delay closing to allow mouse movement back to buttons
    closeTimeoutRef.current = setTimeout(() => {
      console.log('Mega menu timeout executed, closing menu');
      setActiveMenu(null);
      closeTimeoutRef.current = null;
    }, 200);
  };

  console.log('Render - activeMenu:', activeMenu);

  const activeMenuItem = menuItems.find(item => item.id === activeMenu);

  return (
    <>
      {/* Desktop Submenu */}
      <div className="shop-submenu shop-submenu-desktop">
        <div className="container">
          <nav className="submenu-nav">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`submenu-item ${activeMenu === item.id ? 'active' : ''}`}
              >
                <button
                  className="submenu-button"
                  onMouseEnter={() => handleButtonEnter(item.id)}
                  onMouseLeave={handleButtonLeave}
                >
                  {item.label}
                  <i className="fas fa-chevron-down"></i>
                </button>
              </div>
            ))}
          </nav>
        </div>

        {/* Render mega menu for each item, but only show the active one */}
        {menuItems.map((item) => (
          activeMenu === item.id && item.megaMenu && (
            <div
              key={item.id}
              className="mega-menu"
              onMouseEnter={() => handleMegaMenuEnter(item.id)}
              onMouseLeave={handleMegaMenuLeave}
              style={{
                display: 'block !important',
                visibility: 'visible !important',
                opacity: '1 !important',
                position: 'fixed',
                top: '120px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 999999,
                backgroundColor: 'white',
                padding: '2rem',
                minWidth: '700px',
                border: '1px solid rgba(159, 211, 86, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                pointerEvents: 'auto',
              }}
            >
              <div className="mega-menu-content">
                {item.megaMenu.sections.map((section, idx) => (
                  <div key={idx} className="mega-menu-section">
                    <h4 className="mega-menu-title">{section.title}</h4>
                    <ul className="mega-menu-links">
                      {section.links.map((link, linkIdx) => (
                        <li key={linkIdx}>
                          <Link href={link.href}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Mobile Menu Button */}
      <div className="shop-submenu-mobile">
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(true)}
        >
          <i className="fas fa-bars"></i>
          <span>Categories</span>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="mobile-menu-drawer">
            <div className="mobile-menu-header">
              <h3>Shop Categories</h3>
              <button
                className="mobile-menu-close"
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="mobile-menu-content">
              {menuItems.map((item) => (
                <div key={item.id} className="mobile-menu-category">
                  <button
                    className={`mobile-category-button ${expandedCategory === item.id ? 'expanded' : ''}`}
                    onClick={() => setExpandedCategory(expandedCategory === item.id ? null : item.id)}
                  >
                    <span>{item.label}</span>
                    <i className={`fas fa-chevron-${expandedCategory === item.id ? 'down' : 'right'}`}></i>
                  </button>

                  {expandedCategory === item.id && item.megaMenu && (
                    <div className="mobile-subcategories">
                      {item.megaMenu.sections.map((section, idx) => (
                        <div key={idx} className="mobile-subcategory">
                          <button
                            className={`mobile-subcategory-button ${expandedSubcategory === `${item.id}-${idx}` ? 'expanded' : ''}`}
                            onClick={() => setExpandedSubcategory(
                              expandedSubcategory === `${item.id}-${idx}` ? null : `${item.id}-${idx}`
                            )}
                          >
                            <span>{section.title}</span>
                            <i className={`fas fa-chevron-${expandedSubcategory === `${item.id}-${idx}` ? 'down' : 'right'}`}></i>
                          </button>

                          {expandedSubcategory === `${item.id}-${idx}` && (
                            <div className="mobile-links">
                              {section.links.map((link, linkIdx) => (
                                <Link
                                  key={linkIdx}
                                  href={link.href}
                                  className="mobile-link"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ShopSubmenu;
