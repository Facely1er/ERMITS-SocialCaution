import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, TrendingUp, Award, Calendar, Globe, User, Shield, Lock, Key, Heart } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import SocialShare from '../common/SocialShare';
import { useProgressStore } from '../../store/progressStore';

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  type: 'achievement' | 'tip' | 'question' | 'milestone';
  likes: number;
  comments: number;
  timestamp: string;
  isLiked?: boolean;
}

interface CommunityStats {
  totalUsers: number;
  activeToday: number;
  totalPosts: number;
  topContributors: Array<{
    name: string;
    avatar: string;
    points: number;
    level: number;
  }>;
}

const CommunityFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard' | 'tips'>('feed');
  const { level, totalPoints } = useProgressStore();
  const initialPosts: CommunityPost[] = [
    {
      id: '1',
      author: 'PrivacyPro',
      avatar: 'User',
      content: 'Just reached Level 25! The key to consistent progress is completing at least one action item daily. What\'s your daily privacy routine?',
      type: 'milestone',
      likes: 23,
      comments: 8,
      timestamp: '2 hours ago',
      isLiked: false
    },
    {
      id: '2',
      author: 'SecureUser',
      avatar: 'Shield',
      content: 'Pro tip: Enable 2FA on all your accounts, even the ones you think are "unimportant". You never know when they might become a gateway to your more sensitive accounts.',
      type: 'tip',
      likes: 45,
      comments: 12,
      timestamp: '4 hours ago',
      isLiked: true
    },
    {
      id: '3',
      author: 'DataGuardian',
      avatar: 'Lock',
      content: 'Has anyone tried the new privacy-focused browser extensions? Looking for recommendations beyond the usual suspects.',
      type: 'question',
      likes: 12,
      comments: 15,
      timestamp: '6 hours ago',
      isLiked: false
    },
    {
      id: '4',
      author: 'CyberAware',
      avatar: 'Lock',
      content: 'Unlocked the "Security Expert" achievement! Scored 95% on my latest assessment. The detailed action plan really helped me identify weak spots.',
      type: 'achievement',
      likes: 31,
      comments: 6,
      timestamp: '8 hours ago',
      isLiked: false
    }
  ];

  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const stored = localStorage.getItem('community-posts');
    return stored ? JSON.parse(stored) : initialPosts;
  });

  const handleLike = (postId: string) => {
    setPosts(prev => {
      const updated = prev.map(post => {
        if (post.id === postId) {
          const newIsLiked = !post.isLiked;
          return {
            ...post,
            isLiked: newIsLiked,
            likes: newIsLiked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      });
      // Persist to localStorage
      localStorage.setItem('community-posts', JSON.stringify(updated));
      return updated;
    });
  };

  const handleComment = (postId: string) => {
    // In a real app, this would open a comment modal or navigate to a comment section
    // For now, just increment the comment count
    setPosts(prev => {
      const updated = prev.map(post => {
        if (post.id === postId) {
          return { ...post, comments: post.comments + 1 };
        }
        return post;
      });
      // Persist to localStorage
      localStorage.setItem('community-posts', JSON.stringify(updated));
      return updated;
    });
  };

  // Mock data - in a real app, this would come from an API
  const communityStats: CommunityStats = {
    totalUsers: 1247,
    activeToday: 89,
    totalPosts: 3421,
    topContributors: [
      { name: 'PrivacyPro', avatar: 'User', points: 2450, level: 25 },
      { name: 'SecureUser', avatar: 'Shield', points: 2100, level: 21 },
      { name: 'DataGuardian', avatar: 'Lock', points: 1950, level: 20 },
      { name: 'CyberAware', avatar: 'Lock', points: 1800, level: 18 },
      { name: 'PrivacyFirst', avatar: 'Key', points: 1650, level: 17 }
    ]
  };

  const privacyTips = [
    {
      title: 'Use a Password Manager',
      description: 'Generate unique, strong passwords for each account and store them securely.',
      category: 'Passwords',
      difficulty: 'Easy'
    },
    {
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security to your most important accounts.',
      category: 'Security',
      difficulty: 'Easy'
    },
    {
      title: 'Review App Permissions',
      description: 'Regularly audit which apps have access to your personal data.',
      category: 'Mobile',
      difficulty: 'Medium'
    },
    {
      title: 'Use a VPN',
      description: 'Protect your internet traffic, especially on public Wi-Fi networks.',
      category: 'Network',
      difficulty: 'Medium'
    },
    {
      title: 'Regular Security Audits',
      description: 'Conduct monthly reviews of your privacy settings and security measures.',
      category: 'Maintenance',
      difficulty: 'Hard'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Award className="w-4 h-4 text-yellow-500" />;
      case 'tip': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'question': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'milestone': return <Calendar className="w-4 h-4 text-purple-500" />;
      default: return <MessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-100 text-yellow-800';
      case 'tip': return 'bg-green-100 text-green-800';
      case 'question': return 'bg-blue-100 text-blue-800';
      case 'milestone': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Community</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Globe className="w-4 h-4" />
            <span>{communityStats.totalUsers.toLocaleString()} members</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{communityStats.activeToday}</div>
            <div className="text-sm text-gray-600">Active Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{communityStats.totalPosts}</div>
            <div className="text-sm text-gray-600">Total Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{level}</div>
            <div className="text-sm text-gray-600">Your Level</div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card className="p-6">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'feed', label: 'Community Feed', icon: MessageCircle },
            { id: 'leaderboard', label: 'Leaderboard', icon: Award },
            { id: 'tips', label: 'Privacy Tips', icon: TrendingUp }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="space-y-4">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    {post.avatar === 'User' && <User className="h-5 w-5 text-accent" />}
                    {post.avatar === 'Shield' && <Shield className="h-5 w-5 text-accent" />}
                    {post.avatar === 'Lock' && <Lock className="h-5 w-5 text-accent" />}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{post.author}</span>
                      <Badge className={getTypeColor(post.type)}>
                        {getTypeIcon(post.type)}
                        <span className="ml-1">{post.type}</span>
                      </Badge>
                      <span className="text-sm text-gray-500">{post.timestamp}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <button 
                        className={`flex items-center gap-1 transition-colors ${post.isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                        onClick={() => handleLike(post.id)}
                        aria-label={`Like post - ${post.likes} likes`}
                      >
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} /> {post.likes}
                      </button>
                      <button 
                        className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                        onClick={() => handleComment(post.id)}
                        aria-label={`Comment on post - ${post.comments} comments`}
                      >
                        <MessageCircle className="h-4 w-4" /> {post.comments}
                      </button>
                      <SocialShare
                        type="progress"
                        data={{
                          title: post.content.substring(0, 50) + '...',
                          description: post.content,
                          level: level,
                          points: totalPoints
                        }}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Top Contributors</h4>
            {communityStats.topContributors.map((contributor, index) => (
              <motion.div
                key={contributor.name}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-2xl font-bold text-gray-400 w-8">#{index + 1}</div>
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  {contributor.avatar === 'User' && <User className="h-5 w-5 text-accent" />}
                  {contributor.avatar === 'Shield' && <Shield className="h-5 w-5 text-accent" />}
                  {contributor.avatar === 'Lock' && <Lock className="h-5 w-5 text-accent" />}
                  {contributor.avatar === 'Key' && <Key className="h-5 w-5 text-accent" />}
                </div>
                <div className="flex-grow">
                  <div className="font-medium">{contributor.name}</div>
                  <div className="text-sm text-gray-600">Level {contributor.level}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{contributor.points.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">points</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Privacy Tips</h4>
            {privacyTips.map((tip, index) => (
              <motion.div
                key={index}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium">{tip.title}</h5>
                  <Badge variant={tip.difficulty === 'Easy' ? 'success' : tip.difficulty === 'Medium' ? 'warning' : 'danger'}>
                    {tip.difficulty}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-2">{tip.description}</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-100 text-blue-800">{tip.category}</Badge>
                  <SocialShare
                    type="tip"
                    data={{
                      title: tip.title,
                      description: tip.description
                    }}
                    className="text-sm"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CommunityFeatures;