// components/TreeTracking/TreeNameForm.jsx - Inline tree naming form
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { showNotification } from '@/components/Notification';
import { Edit3 } from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export default function TreeNameForm({ treeId, currentName, onSave }) {
  const t = useTranslations('treeTracking');
  const { isLoggedIn, getAuthHeaders } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentName || '');
  const [saving, setSaving] = useState(false);

  const handleStartEditing = () => {
    if (!isLoggedIn) {
      showNotification('Please log in to name your tree', 'info');
      return;
    }
    setEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length > 50) {
      showNotification('Tree name must be 1-50 characters', 'error');
      return;
    }

    setSaving(true);
    try {
      const response = await axios.put(
        `${API_BASE}/api/trees/${treeId}/name`,
        { treeName: trimmedName },
        { headers: getAuthHeaders() }
      );
      if (response.data.success) {
        showNotification('Tree named successfully!', 'success');
        setEditing(false);
        if (onSave) onSave(trimmedName);
      }
    } catch (err) {
      showNotification(
        err.response?.data?.message || 'Failed to name tree',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  // Show current name if set and not editing
  if (currentName && !editing) {
    return (
      <div style={{ margin: '16px 0' }}>
        <button className="name-tree-trigger" onClick={handleStartEditing}>
          <Edit3 size={14} />
          {currentName}
        </button>
      </div>
    );
  }

  // Show "Name Your Tree" button when not editing
  if (!editing) {
    return (
      <button className="name-tree-trigger" onClick={handleStartEditing}>
        <Edit3 size={14} />
        {t('nameYourTree')}
      </button>
    );
  }

  // Show inline form when editing
  return (
    <form className="tree-name-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('nameTreePlaceholder')}
        maxLength={50}
        autoFocus
        disabled={saving}
      />
      <button type="submit" disabled={saving || !name.trim()}>
        {saving ? 'Saving...' : t('saveTreeName')}
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        style={{
          padding: '10px 16px',
          background: '#f5f5f5',
          color: '#666',
          border: '1px solid #ddd',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer',
          minHeight: '44px',
        }}
      >
        Cancel
      </button>
    </form>
  );
}
