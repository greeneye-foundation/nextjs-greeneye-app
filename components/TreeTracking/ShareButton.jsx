// components/TreeTracking/ShareButton.jsx - Copy-to-clipboard share button
import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { showNotification } from '@/components/Notification';

export default function ShareButton({ trackingUrl }) {
  const t = useTranslations('treeTracking');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(trackingUrl);
      } else {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = trackingUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      showNotification(t('shareCopied'), 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showNotification('Failed to copy link', 'error');
    }
  };

  return (
    <button
      className="share-btn"
      onClick={handleShare}
      aria-label={t('shareButton')}
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {t('shareButton')}
    </button>
  );
}
