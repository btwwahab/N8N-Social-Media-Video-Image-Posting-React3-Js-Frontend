import React, { useState, useEffect } from 'react';
import WorkflowVisualization from './components/WorkflowVisualization';
import LoadingSpinner from './components/LoadingSpinner';
import PostPreview from './components/PostPreview';
import PlatformSelector from './components/PlatformSelector';
import ToastNotification from './components/ToastNotification';
import AIAssistant from './components/AIAssistant';

function App() {
  const [topic, setTopic] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['linkedin']);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [confirmUrl, setConfirmUrl] = useState('');
  const [workflowStep, setWorkflowStep] = useState(1);
  const [hashtags, setHashtags] = useState([]);
  const [aiAssistantState, setAiAssistantState] = useState('ready');

  useEffect(() => {
    if (generatedPost) {
      const hashtagRegex = /#[a-zA-Z0-9_]+/g;
      const extractedHashtags = generatedPost.match(hashtagRegex) || [];
      setHashtags(extractedHashtags.map(tag => tag.slice(1)));
    }
  }, [generatedPost]);

  const generatePost = async () => {
    if (!topic.trim()) {
      showNotification('error', 'Please enter a topic to generate a post.');
      return;
    }

    setIsLoading(true);
    setWorkflowStep(2);
    setAiAssistantState('generating');
    clearNotification();

    try {
      const response = await fetch('https://abwahab12.app.n8n.cloud/webhook/36549d14-0976-4efb-b91c-314fbae8df65', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      // Handle the response format from your n8n workflow
      const postContent = data.generatedPost || data.output || '';
      setGeneratedPost(postContent);
      setConfirmUrl(data.confirmUrl || 'https://abwahab12.app.n8n.cloud/webhook/confirm-post');
      setWorkflowStep(3);
      setAiAssistantState('success');
      showNotification('success', '🚀 Amazing content generated! Your post is ready for customization.');
    } catch (error) {
      setWorkflowStep(1);
      setAiAssistantState('error');
      showNotification('error', `Failed to generate post: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const publishPost = async () => {
    if (!generatedPost.trim()) {
      showNotification('error', 'Please generate or enter a post before publishing.');
      return;
    }

    if (selectedPlatforms.length === 0) {
      showNotification('error', 'Please select at least one platform to publish to.');
      return;
    }

    setIsPublishing(true);
    setWorkflowStep(4);
    setAiAssistantState('publishing');
    clearNotification();

    try {
      // Map frontend platform names to match n8n workflow expectations
      const platformMapping = {
        'linkedin': 'linkedin',
        'facebook': 'facebook', 
        'instagram': 'instagram'
      };

      // Send separate requests for each platform to ensure all execute
      console.log(`Publishing to platforms: ${selectedPlatforms.join(', ')}`);
      
      const publishPromises = selectedPlatforms.map(async (platform) => {
        const response = await fetch('https://abwahab12.app.n8n.cloud/webhook/confirm-post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            post: generatedPost,
            platforms: [platformMapping[platform] || platform],
            immediate: true,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to publish to ${platform}: ${response.status}`);
        }
        
        return await response.json();
      });
      
      // Wait for all platforms to complete
      const results = await Promise.all(publishPromises);

      console.log('Request payload for all platforms:', {
        post: generatedPost.substring(0, 100) + '...', // Truncated for logging
        platforms: selectedPlatforms.map(p => platformMapping[p] || p),
        immediate: true
      });

      console.log('Successfully published to all platforms:', results);

      // Since we're sending all platforms in separate requests, show success for all selected platforms
      setWorkflowStep(5);
      setAiAssistantState('success');
      showNotification('success', `🎉 Post successfully published to ${selectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}!`);      setTimeout(() => {
        setTopic('');
        setGeneratedPost('');
        setConfirmUrl('');
        setWorkflowStep(1);
        setHashtags([]);
        setAiAssistantState('ready');
      }, 3000);
    } catch (error) {
      console.error('Publishing error:', error);
      setWorkflowStep(3);
      setAiAssistantState('error');
      showNotification('error', `Failed to publish post: ${error.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePlatformChange = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const clearNotification = () => {
    setNotification({ type: '', message: '' });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900  to-gray-900 relative overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-full py-8 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-x-hidden">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 tracking-tight">
            🚀 AI Social Automation Hub
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Generate • Customize • Publish • Automate
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              AI-Powered Content Generation
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
              Multi-Platform Publishing
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
              Real-time Automation
            </div>
          </div>
        </div>

        <WorkflowVisualization 
          currentStep={workflowStep}
          isGenerating={isLoading}
          isPublishing={isPublishing}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 xl:gap-8">
          <div className="lg:col-span-1 flex flex-col space-y-6">
            <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl border border-cyan-500/30 shadow-xl p-6 group hover:border-cyan-400/50 transition-all duration-300 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Content Topic
                </h3>
                <div className="text-xs text-cyan-400 font-medium bg-cyan-400/10 px-2 py-1 rounded-full">
                  STEP 1
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="✨ Enter your content idea..."
                  className="w-full p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  disabled={isLoading}
                  onKeyPress={(e) => e.key === 'Enter' && generatePost()}
                />
                {topic && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-cyan-400/20 border border-cyan-400/30 rounded-full text-xs text-cyan-400 font-medium">
                    {topic.length} chars
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={generatePost}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-4 px-6 rounded-xl hover:from-purple-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <LoadingSpinner text="AI Generating" className="justify-center" />
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">🤖</span>
                      Generate Post
                    </div>
                  )}
                </button>
                
                {generatedPost && (
                  <button
                    onClick={generatePost}
                    disabled={isLoading}
                    className="bg-gray-700/50 backdrop-blur-sm text-gray-300 py-4 px-6 rounded-xl hover:bg-gray-600/50 disabled:bg-gray-800/50 disabled:cursor-not-allowed transition-all duration-300 font-medium text-sm border border-gray-600/50 hover:border-gray-500/50"
                  >
                    🔄 Regenerate
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1">
              <PlatformSelector 
                platforms={selectedPlatforms}
                onPlatformChange={handlePlatformChange}
              />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <PostPreview 
              post={generatedPost}
              onPostChange={(e) => setGeneratedPost(e.target.value)}
              hashtags={hashtags}
            />

            {generatedPost && (
              <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl border border-green-500/30 shadow-xl p-6 hover:border-green-400/50 transition-all duration-300">
                <button
                  onClick={publishPost}
                  disabled={isPublishing || selectedPlatforms.length === 0}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-6 px-8 rounded-xl hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg hover:scale-[1.01] active:scale-[0.99] group"
                >
                  {isPublishing ? (
                    <LoadingSpinner text="Publishing to platforms" className="justify-center" />
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-2xl group-hover:animate-bounce">🚀</span>
                      <div>
                        <div>Publish to {selectedPlatforms.length} Platform{selectedPlatforms.length > 1 ? 's' : ''}</div>
                        <div className="text-sm opacity-80 font-normal">
                          {selectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' • ')}
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 bg-gray-900/50 backdrop-blur-md rounded-full px-6 py-3 border border-gray-700/50">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Powered by</span>
            </div>
            <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Aziona Automation & AI
            </span>
          </div>
        </div>
      </div>

      <ToastNotification 
        type={notification.type} 
        message={notification.message} 
        onClose={clearNotification} 
      />

      <AIAssistant 
        isGenerating={isLoading}
        isPublishing={isPublishing}
        lastAction={notification.type}
      />
    </div>
  );
}

export default App;