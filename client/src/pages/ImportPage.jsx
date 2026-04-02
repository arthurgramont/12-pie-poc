import { useState } from 'react';
import { Link2, Plus, X, ChevronLeft, ArrowRight, Hash, Check } from 'lucide-react';

function ImportPage({ destination, onDone, onBack }) {
  const [url, setUrl] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingHashtagsId, setEditingHashtagsId] = useState(null);
  const [hashtagInput, setHashtagInput] = useState('');

  // Extract hashtags from text (client-side)
  const extractHashtagsFromText = (text) => {
    if (!text) return [];
    const matches = text.match(/#[\w\u00C0-\u024F\u1E00-\u1EFF]+/gu);
    if (!matches) return [];
    const seen = new Set();
    return matches.filter((tag) => {
      const lower = tag.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });
  };

  const handleSaveHashtags = (videoId) => {
    const tags = extractHashtagsFromText(hashtagInput);
    if (tags.length > 0) {
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, hashtags: tags } : v))
      );
    }
    setEditingHashtagsId(null);
    setHashtagInput('');
  };

  const detectPlatform = (link) => {
    if (link.includes('tiktok.com')) return 'tiktok';
    if (link.includes('instagram.com')) return 'instagram';
    return null;
  };

  const handleAddVideo = async () => {
    if (!url.trim()) return;

    const platform = detectPlatform(url);
    if (!platform) {
      setError('Lien non reconnu. Utilisez un lien TikTok ou Instagram.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Try to fetch metadata from our backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/video/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setVideos((prev) => [
          ...prev,
          {
            id: Date.now(),
            url: url.trim(),
            platform,
            title: data.title || 'Vidéo importée',
            author: data.author_name || 'Utilisateur',
            thumbnail: data.thumbnail_url || null,
            hashtags: data.hashtags || [],
          },
        ]);
      } else {
        // Fallback: just add with basic info
        setVideos((prev) => [
          ...prev,
          {
            id: Date.now(),
            url: url.trim(),
            platform,
            title: platform === 'tiktok' ? 'Vidéo TikTok' : 'Vidéo Instagram',
            author: 'Utilisateur',
            thumbnail: null,
            hashtags: [],
          },
        ]);
      }
    } catch {
      // Offline mode: still add the video with basic info
      setVideos((prev) => [
        ...prev,
        {
          id: Date.now(),
          url: url.trim(),
          platform,
          title: platform === 'tiktok' ? 'Vidéo TikTok' : 'Vidéo Instagram',
          author: 'Utilisateur',
          thumbnail: null,
          hashtags: [],
        },
      ]);
    }

    setUrl('');
    setLoading(false);
  };

  const handleRemoveVideo = (id) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddVideo();
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={20} />
      </button>

      <div className="page-header" style={{ paddingTop: 12 }}>
        <h1 style={{ fontSize: 24 }}>🎥 Inspirations</h1>
        <p className="subtitle">
          Partagez des vidéos TikTok ou Instagram pour personnaliser vos recommandations
        </p>
      </div>

      <div className="video-import-section" style={{ flex: 1 }}>
        {/* Input */}
        <div className="video-input-group">
          <input
            type="url"
            className="form-input"
            placeholder="Coller un lien TikTok ou Insta..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            id="video-url-input"
          />
          <button
            className="btn btn-primary btn-icon"
            onClick={handleAddVideo}
            disabled={loading}
            id="add-video-btn"
            style={{ width: 48, height: 48, flexShrink: 0 }}
          >
            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <Plus size={20} />}
          </button>
        </div>

        {error && (
          <p style={{ color: 'var(--accent-red)', fontSize: 13 }}>{error}</p>
        )}

        {/* Platforms hint */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'center',
          }}
        >
          <span className="badge badge-purple">
            <span style={{ marginRight: 4 }}>♪</span> TikTok
          </span>
          <span className="badge badge-pink" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#F472B6' }}>
            <span style={{ marginRight: 4 }}>📷</span> Instagram
          </span>
        </div>

        {/* Imported videos list */}
        {videos.length > 0 && (
          <div>
            <h3 style={{ fontSize: 15, marginBottom: 12, color: 'var(--text-secondary)' }}>
              {videos.length} vidéo{videos.length > 1 ? 's' : ''} importée{videos.length > 1 ? 's' : ''}
            </h3>
            {videos.map((video) => (
              <div key={video.id} className="video-preview-card" style={{ marginBottom: 8 }}>
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt=""
                    className="video-preview-thumb"
                  />
                ) : (
                  <div
                    className="video-preview-thumb"
                    style={{
                      background: video.platform === 'tiktok'
                        ? 'linear-gradient(135deg, #000, #25F4EE)'
                        : 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 28,
                    }}
                  >
                    {video.platform === 'tiktok' ? '♪' : '📷'}
                  </div>
                )}
                <div className="video-preview-info">
                  <h4>{video.title}</h4>
                  <span className="author">@{video.author}</span>
                  <span
                    className="platform badge"
                    style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      width: 'fit-content',
                      background:
                        video.platform === 'tiktok'
                          ? 'rgba(37, 244, 238, 0.15)'
                          : 'rgba(236, 72, 153, 0.15)',
                      color:
                        video.platform === 'tiktok' ? '#25F4EE' : '#F472B6',
                    }}
                  >
                    {video.platform === 'tiktok' ? 'TikTok' : 'Instagram'}
                  </span>
                  {video.hashtags && video.hashtags.length > 0 && (
                    <div className="hashtags-container" style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 4,
                      marginTop: 6,
                    }}>
                      {video.hashtags.slice(0, 8).map((tag, i) => (
                        <span
                          key={i}
                          className="hashtag-badge"
                          style={{
                            fontSize: 10,
                            padding: '2px 8px',
                            borderRadius: 12,
                            background: 'rgba(139, 92, 246, 0.15)',
                            color: '#A78BFA',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {video.hashtags.length > 8 && (
                        <span style={{
                          fontSize: 10,
                          padding: '2px 8px',
                          borderRadius: 12,
                          background: 'rgba(139, 92, 246, 0.1)',
                          color: '#7C3AED',
                          fontWeight: 500,
                        }}>
                          +{video.hashtags.length - 8}
                        </span>
                      )}
                    </div>
                  )}
                  {/* Show hashtag input for videos without hashtags */}
                  {(!video.hashtags || video.hashtags.length === 0) && editingHashtagsId !== video.id && (
                    <button
                      onClick={() => {
                        setEditingHashtagsId(video.id);
                        setHashtagInput('');
                      }}
                      style={{
                        marginTop: 6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11,
                        color: '#A78BFA',
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px dashed rgba(139, 92, 246, 0.3)',
                        borderRadius: 8,
                        padding: '4px 10px',
                        cursor: 'pointer',
                      }}
                    >
                      <Hash size={12} />
                      Ajouter les hashtags
                    </button>
                  )}
                  {editingHashtagsId === video.id && (
                    <div style={{ marginTop: 6, display: 'flex', gap: 4, alignItems: 'center' }}>
                      <input
                        type="text"
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveHashtags(video.id);
                        }}
                        placeholder="Coller la description ici..."
                        autoFocus
                        style={{
                          flex: 1,
                          fontSize: 11,
                          padding: '4px 8px',
                          borderRadius: 8,
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          background: 'rgba(139, 92, 246, 0.05)',
                          color: '#E2E8F0',
                          outline: 'none',
                          minWidth: 0,
                        }}
                      />
                      <button
                        onClick={() => handleSaveHashtags(video.id)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: 'rgba(139, 92, 246, 0.2)',
                          border: 'none',
                          color: '#A78BFA',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <button
                  className="video-remove-btn"
                  onClick={() => handleRemoveVideo(video.id)}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {videos.length === 0 && (
          <div className="empty-state" style={{ padding: '32px 16px' }}>
            <div className="empty-state-icon">
              <Link2 size={40} strokeWidth={1} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 style={{ fontSize: 16 }}>Aucune vidéo importée</h3>
            <p style={{ fontSize: 13 }}>
              Collez un lien de vidéo voyage pour améliorer nos recommandations
            </p>
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <button
          className="btn btn-primary btn-full"
          onClick={() => onDone(videos)}
          id="continue-to-swipe-btn"
        >
          Continuer
          <ArrowRight size={18} />
        </button>
        {videos.length === 0 && (
          <button
            className="skip-link"
            onClick={() => onDone([])}
            style={{ marginTop: 8, width: '100%' }}
          >
            Passer cette étape →
          </button>
        )}
      </div>
    </div>
  );
}

export default ImportPage;
