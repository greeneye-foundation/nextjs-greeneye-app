"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '@/components/encyclopedia/LanguageSwitcher';
import CountrySelector from '@/components/encyclopedia/CountrySelector';
import { articlesAPI } from '@/lib/api/encyclopedia';
import { useEncyclopedia } from '@/context/EncyclopediaContext';
import '@/styles/encyclopedia-admin-layout.css';

const EncyclopediaAdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { language, country } = useEncyclopedia();

  // State for badge counts
  const [badgeCounts, setBadgeCounts] = useState({
    all: 0,
    pending_review: 0,
    draft: 0,
    archived: 0
  });

  // Fetch badge counts on mount and when language/country changes
  useEffect(() => {
    fetchBadgeCounts();
  }, [language, country]);

  const fetchBadgeCounts = async () => {
    try {
      // Fetch counts for each status in parallel
      const [allResponse, pendingResponse, draftResponse, archivedResponse] = await Promise.all([
        articlesAPI.getAll({ 
          language
        }),
        articlesAPI.getAll({ 
          status: 'pending_review', 
          language
        }),
        articlesAPI.getAll({ 
          status: 'draft', 
          language
        }),
        articlesAPI.getAll({ 
          status: 'archived', 
          language
        })
      ]);

      setBadgeCounts({
        all: allResponse?.data?.pagination?.totalArticles || 0,
        pending_review: pendingResponse?.data?.pagination?.totalArticles || 0,
        draft: draftResponse?.data?.pagination?.totalArticles || 0,
        archived: archivedResponse?.data?.pagination?.totalArticles || 0
      });
    } catch (error) {
      console.error('Error fetching badge counts:', error);
      // Keep previous counts on error
    }
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'fa-dashboard',
      path: '/admin',
      badge: null
    },
    {
      title: 'Articles',
      icon: 'fa-file-alt',
      path: '/admin/encyclopedia/articles',
      badge: null,
      submenu: [
        { 
          title: 'All Articles', 
          path: '/admin/encyclopedia/articles',
          badge: badgeCounts.all > 0 ? badgeCounts.all.toString() : null
        },
        { 
          title: 'Create New', 
          path: '/admin/encyclopedia/articles/create' 
        },
        { 
          title: 'Pending Review', 
          path: '/admin/encyclopedia/articles/pending', 
          badge: badgeCounts.pending_review > 0 ? badgeCounts.pending_review.toString() : null
        },
        { 
          title: 'Drafts', 
          path: '/admin/encyclopedia/articles/drafts',
          badge: badgeCounts.draft > 0 ? badgeCounts.draft.toString() : null
        },
        { 
          title: 'Archived', 
          path: '/admin/encyclopedia/articles/archived',
          badge: badgeCounts.archived > 0 ? badgeCounts.archived.toString() : null
        }
      ]
    },
    {
      title: 'Categories',
      icon: 'fa-folder',
      path: '/admin/encyclopedia/categories',
      badge: null
    },
    {
      title: 'Tags',
      icon: 'fa-tags',
      path: '/admin/encyclopedia/tags',
      badge: null
    },
    {
      title: 'Countries',
      icon: 'fa-globe',
      path: '/admin/encyclopedia/countries',
      badge: null
    },
    {
      title: 'Media Library',
      icon: 'fa-images',
      path: '/admin/encyclopedia/media',
      badge: null
    },
    // {
    //   title: 'Authors',
    //   icon: 'fa-users',
    //   path: '/admin/encyclopedia/authors',
    //   badge: null
    // },
    {
      title: 'Analytics',
      icon: 'fa-chart-line',
      path: '/admin/encyclopedia/analytics',
      badge: null
    },
    // {
    //   title: 'Settings',
    //   icon: 'fa-cog',
    //   path: '/admin/encyclopedia/settings',
    //   badge: null
    // }
  ];

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <div className="encyclopedia-admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <i className="fas fa-book"></i>
            {sidebarOpen && <span>Encyclopedia CMS</span>}
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            <i className={`fas fa-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <div key={index} className="nav-item-wrapper">
              <Link
                href={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <i className={`fas ${item.icon}`}></i>
                {sidebarOpen && (
                  <>
                    <span className="nav-text">{item.title}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </>
                )}
              </Link>

              {item.submenu && sidebarOpen && isActive(item.path) && (
                <div className="submenu">
                  {item.submenu.map((sub, subIndex) => (
                    <Link
                      key={subIndex}
                      href={sub.path}
                      className={`submenu-item ${pathname === sub.path ? 'active' : ''}`}
                    >
                      <span>{sub.title}</span>
                      {sub.badge && <span className="submenu-badge">{sub.badge}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link href="/" className="back-to-site">
            <i className="fas fa-arrow-left"></i>
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="header-left">
            <button
              className="mobile-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="page-title">Environmental Encyclopedia</h1>
          </div>

          <div className="header-right">
            <CountrySelector variant="compact" />
            <LanguageSwitcher variant="compact" />

            <div className="header-notifications">
              <button className="notification-btn" aria-label="Notifications">
                <i className="fas fa-bell"></i>
                <span className="notification-count">3</span>
              </button>
            </div>

            <div className="header-user">
              <img
                src="/images/default-avatar.png"
                alt="User Avatar"
                className="user-avatar"
              />
              <span className="user-name">Admin User</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default EncyclopediaAdminLayout;