import React, { useState, useEffect } from 'react';

const PostPreview = ({ post, onPostChange, hashtags = [], imageUrl = null, videoUrl = null, mediaType = 'image', onModalChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [tempPost, setTempPost] = useState('');
  
  const hasMedia = imageUrl || videoUrl;
  const currentMediaUrl = mediaType === 'video' ? videoUrl : imageUrl;

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && (isModalOpen || isTextModalOpen)) {
        setIsModalOpen(false);
        setIsTextModalOpen(false);
      }
    };

    if (isModalOpen || isTextModalOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      // Notify parent component
      onModalChange?.(true);
    } else {
      onModalChange?.(false);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isTextModalOpen, onModalChange]);

  const openTextModal = () => {
    setTempPost(post);
    setIsTextModalOpen(true);
  };

  const closeTextModal = () => {
    setIsTextModalOpen(false);
  };

  const saveAndCloseTextModal = () => {
    onPostChange({ target: { value: tempPost } });
    setIsTextModalOpen(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tempPost);
  };

  return (
    <>
      {/* Full Screen Media Modal */}
      {isModalOpen && hasMedia && (
        <div 
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Close Button - Top Right Outside */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="fixed top-4 right-4 z-20 w-14 h-14 bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 backdrop-blur-xl rounded-full flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 hover:scale-110 hover:rotate-90 shadow-[0_0_30px_rgba(239,68,68,0.6)] border-2 border-red-300/50 group"
            aria-label="Close modal"
          >
            <span className="group-hover:scale-125 transition-transform">✕</span>
          </button>
          
          {/* Media Info Badge - Top Left Outside */}
          <div className="fixed top-4 left-4 z-20 px-5 py-3 bg-gray-900/90 backdrop-blur-xl rounded-xl border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <div className="text-sm font-bold text-cyan-400 flex items-center">
              <span className="mr-2">{mediaType === 'video' ? '🎬' : '🎨'}</span>
              AI Generated {mediaType === 'video' ? 'Video' : 'Image'}
            </div>
            <div className="text-xs text-gray-400 mt-1">Click outside or press ESC to close</div>
          </div>
          
          {/* Media Container with Glow Effect */}
          <div className="relative flex items-center justify-center p-20">
            {mediaType === 'video' ? (
              <video 
                src={videoUrl} 
                controls
                autoPlay
                loop
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.3)] border-4 border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img 
                src={imageUrl} 
                alt="Full Size Preview" 
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.3)] border-4 border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            
            {/* Decorative Corner Accents */}
            <div className="absolute top-20 left-20 w-8 h-8 border-t-4 border-l-4 border-purple-500 rounded-tl-2xl"></div>
            <div className="absolute top-20 right-20 w-8 h-8 border-t-4 border-r-4 border-cyan-500 rounded-tr-2xl"></div>
            <div className="absolute bottom-20 left-20 w-8 h-8 border-b-4 border-l-4 border-cyan-500 rounded-bl-2xl"></div>
            <div className="absolute bottom-20 right-20 w-8 h-8 border-b-4 border-r-4 border-purple-500 rounded-br-2xl"></div>
          </div>
          
          {/* Download Button - Bottom Right Outside */}
          <a
            href={currentMediaUrl}
            download={`ai-generated-${mediaType}.${mediaType === 'video' ? 'mp4' : 'png'}`}
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-4 right-4 z-20 px-6 py-4 bg-linear-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 backdrop-blur-xl rounded-xl flex items-center space-x-3 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] shadow-[0_0_30px_rgba(6,182,212,0.4)] border-2 border-cyan-400/50 group"
          >
            <span className="text-2xl group-hover:animate-bounce">⬇</span>
            <span>Download {mediaType === 'video' ? 'Video' : 'Image'}</span>
          </a>
          
          {/* Media Quality Badge - Bottom Left Outside */}
          <div className="fixed bottom-4 left-4 z-20 px-4 py-2 bg-green-500/80 backdrop-blur-xl rounded-lg border-2 border-green-400/50 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            <div className="text-xs font-bold text-white flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              HD Quality • Ready for Publishing
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Text Editor Modal */}
      {isTextModalOpen && (
        <div 
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fadeIn"
          onClick={closeTextModal}
        >
          {/* Close Button - Top Right */}
          <button
            onClick={closeTextModal}
            className="fixed top-4 right-4 z-20 w-14 h-14 bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 backdrop-blur-xl rounded-full flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 hover:scale-110 hover:rotate-90 shadow-[0_0_30px_rgba(239,68,68,0.6)] border-2 border-red-300/50 group"
            aria-label="Close modal"
          >
            <span className="group-hover:scale-125 transition-transform">✕</span>
          </button>
          
          {/* Text Editor Info Badge - Top Left */}
          <div className="fixed top-4 left-4 z-20 px-5 py-3 bg-gray-900/90 backdrop-blur-xl rounded-xl border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            <div className="text-sm font-bold text-purple-400 flex items-center">
              <span className="mr-2">✍️</span>
              Edit Your Post
            </div>
            <div className="text-xs text-gray-400 mt-1">Edit, copy, then save or close</div>
          </div>
          
          {/* Text Editor Container */}
          <div 
            className="relative w-full max-w-5xl mx-4 bg-gray-900/90 backdrop-blur-xl rounded-2xl border-4 border-purple-500/30 shadow-[0_0_80px_rgba(168,85,247,0.3)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Character Count */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium text-gray-400">
                <span className="text-purple-400 font-bold">{tempPost.length}</span> characters
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">LIVE EDITING</span>
              </div>
            </div>
            
            {/* Large Textarea */}
            <textarea
              value={tempPost}
              onChange={(e) => setTempPost(e.target.value)}
              className="w-full h-[60vh] p-6 bg-gray-800/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-200 placeholder-gray-500 transition-all duration-300 focus:shadow-[0_0_20px_rgba(168,85,247,0.3)] text-base leading-relaxed"
              placeholder="✨ Edit your AI-generated post..."
            />
            
            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 backdrop-blur-xl rounded-xl flex items-center space-x-2 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] shadow-[0_0_20px_rgba(6,182,212,0.3)] border-2 border-cyan-400/50 group"
              >
                <span className="text-xl">📋</span>
                <span>Copy to Clipboard</span>
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={closeTextModal}
                  className="px-6 py-3 bg-white hover:bg-gray-100 backdrop-blur-xl rounded-xl text-gray-900 font-bold transition-all duration-300 hover:scale-105 border-2 border-gray-300 hover:border-gray-400 shadow-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAndCloseTextModal}
                  className="px-6 py-3 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 backdrop-blur-xl rounded-xl flex items-center space-x-2 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] shadow-[0_0_20px_rgba(34,197,94,0.3)] border-2 border-green-400/50"
                >
                  <span>✓</span>
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 group hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(6,182,212,0.2)]">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Post Preview
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span className="text-xs text-green-400 font-medium">LIVE PREVIEW</span>
            </div>
          </div>
          
          <div className="flex items-center mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <div className="relative">
              <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-semibold text-gray-200">AI Social Assistant</div>
              <div className="text-xs text-cyan-400 flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
                Generated content • Ready to publish
              </div>
            </div>
            <div className="ml-auto">
              <div className="text-xs text-gray-500">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      
      {/* Content Grid - Text Area and Media Side by Side */}
      <div className={`grid gap-4 ${hasMedia ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Text Area Section */}
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-400 mb-3 flex items-center">
            <span className="mr-2">✍️</span>
            AI Generated Post
            <span className="ml-2 text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">
              Powered by Artificial Intelligence
            </span>
            <span className="ml-auto text-xs text-purple-400 flex items-center">
              <span className="mr-1">🔍</span>
              Click to enlarge
            </span>
          </div>
          <div className="relative group/textarea flex-1">
            <textarea
              value={post}
              onChange={onPostChange}
              onClick={openTextModal}
              placeholder="✨ Your AI-generated post will appear here with futuristic magic..."
              className="w-full p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-600/50 rounded-xl resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-200 placeholder-gray-500 transition-all duration-300 focus:shadow-[0_0_20px_rgba(6,182,212,0.2)] text-sm leading-relaxed h-full min-h-[400px] cursor-pointer hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
              rows="12"
            />
            {post && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-green-400/20 border border-green-400/30 rounded-full text-xs text-green-400 font-medium">
                {post.length} chars
              </div>
            )}
          </div>
        </div>
        
        {/* AI Generated Media Preview (Image or Video) */}
        {hasMedia && (
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-400 mb-3 flex items-center">
              <span className="mr-2">{mediaType === 'video' ? '🎬' : '🎨'}</span>
              AI Generated {mediaType === 'video' ? 'Video' : 'Image'}
              <span className="ml-2 text-xs text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full">
                Powered by {mediaType === 'video' ? 'Veo 2.0' : 'Imagen 4.0'}
              </span>
              <span className="ml-auto text-xs text-cyan-400 flex items-center">
                <span className="mr-1">🔍</span>
                Click to {mediaType === 'video' ? 'play' : 'enlarge'}
              </span>
            </div>
            <div 
              className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-gray-800/30 hover:border-cyan-400/50 transition-all duration-300 group flex-1 cursor-pointer hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              onClick={() => setIsModalOpen(true)}
              title={`Click to view full size ${mediaType}`}
            >
              <div className="relative h-full flex flex-col">
                <div className="flex-1 p-2 flex items-center justify-center">
                  {mediaType === 'video' ? (
                    <video 
                      src={videoUrl} 
                      className="w-full h-full object-contain rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.05] max-h-[350px]"
                      onError={(e) => {
                        console.error('Video failed to load:', videoUrl);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      onLoadedData={(e) => {
                        console.log('Video loaded successfully');
                        e.target.nextSibling.style.display = 'none';
                      }}
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img 
                      src={imageUrl} 
                      alt="AI Generated Content" 
                      className="w-full h-full object-contain rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.05] max-h-[350px]"
                      onError={(e) => {
                        console.error('Image failed to load:', imageUrl);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully');
                        e.target.nextSibling.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="hidden items-center justify-center h-48 bg-gray-700/50 rounded-lg text-gray-400">
                    <div className="text-center">
                      <span className="text-3xl mb-2 block">{mediaType === 'video' ? '🎬' : '🖼️'}</span>
                      <span className="text-sm">{mediaType === 'video' ? 'Video' : 'Image'} preview unavailable</span>
                      <p className="text-xs text-gray-500 mt-1">{mediaType === 'video' ? 'Video' : 'Image'} will still be posted</p>
                    </div>
                  </div>
                </div>
                
                {/* Media overlay badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <div className="px-2 py-1 bg-linear-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-sm border border-purple-400/30 rounded-full text-xs text-white font-medium shadow-lg">
                    AI Generated
                  </div>
                  <div className="px-2 py-1 bg-green-500/90 backdrop-blur-sm border border-green-400/30 rounded-full text-xs text-white font-medium shadow-lg flex items-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span>
                    Ready
                  </div>
                  {mediaType === 'video' && (
                    <div className="px-2 py-1 bg-cyan-500/90 backdrop-blur-sm border border-cyan-400/30 rounded-full text-xs text-white font-medium shadow-lg">
                      ▶ Video
                    </div>
                  )}
                </div>
                
                {/* Media info footer */}
                <div className="px-3 py-2 bg-gray-800/50 border-t border-gray-700/30 flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center">
                    <span className="mr-1">✨</span>
                    HD Quality
                  </span>
                  <span className="text-cyan-400 font-medium">
                    Multi-Platform
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {hashtags.length > 0 && (
        <div className="mt-6">
          <div className="text-sm font-medium text-gray-400 mb-3 flex items-center">
            <span className="mr-2">🏷️</span>
            Suggested Hashtags
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-linear-to-r from-purple-500/20 to-cyan-500/20 border border-purple-400/30 rounded-full text-xs text-purple-300 cursor-pointer hover:border-purple-400/50 hover:shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-all duration-300 hover:scale-105"
                onClick={() => {
                  const textarea = document.querySelector('textarea');
                  if (textarea && !post.includes(tag)) {
                    onPostChange({ target: { value: post + ' ' + tag } });
                  }
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6 flex items-center text-sm text-gray-400 bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
        <span className="text-cyan-400 mr-2">💡</span>
        <span>Click hashtags to add them • Edit text to personalize • Click {mediaType === 'video' ? 'video to play' : 'image to enlarge'}</span>
      </div>
    </div>
    </>
  );
};

export default PostPreview;