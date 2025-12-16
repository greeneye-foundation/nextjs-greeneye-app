"use client";

import React, { useState, useEffect } from 'react';
import ArticlesPage from '../page';

const PendingArticlesPage = () => {
  // This will use the same ArticlesPage component but with status filter
  return <ArticlesPage initialStatus="pending_review" />;
};

export default PendingArticlesPage;