import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Flame, Target, Share2, Shield } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { useProgressStore } from '../../store/progressStore';

const ProgressTracker: React.FC = () => {
  const {
    totalPoints,
    level,
    currentLevelPoints,
    nextLevelPoints,
    streak,
    achievements,
    completedActions,
    assessmentCount,
    socialShares
  } = useProgressStore();

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const recentAchievements = unlockedAchievements
    .filter(a => a.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
    .slice(0, 3);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'assessment': return <Target className="w-4 h-4" />;
      case 'action': return <Star className="w-4 h-4" />;
      case 'streak': return <Flame className="w-4 h-4" />;
      case 'social': return <Share2 className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'assessment': return 'bg-blue-100 text-blue-800';
      case 'action': return 'bg-green-100 text-green-800';
      case 'streak': return 'bg-orange-100 text-orange-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Level Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Your Progress</h3>
          <Badge variant="primary" className="text-lg px-3 py-1">
            Level {level}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Points */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total Points</span>
            <span className="text-lg font-bold text-primary">{totalPoints.toLocaleString()}</span>
          </div>

          {/* Level Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Level Progress</span>
              <span>{currentLevelPoints}/{nextLevelPoints} points</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-primary to-primary-dark h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentLevelPoints / nextLevelPoints) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedActions.length}</div>
              <div className="text-sm text-gray-600">Actions Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{assessmentCount}</div>
              <div className="text-sm text-gray-600">Assessments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{socialShares}</div>
              <div className="text-sm text-gray-600">Shares</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card className="p-4">
          <h3 className="text-xl font-semibold mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {recentAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-grow">
                  <div className="font-medium text-gray-900">{achievement.title}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(achievement.category)}>
                    {getCategoryIcon(achievement.category)}
                    <span className="ml-1">{achievement.category}</span>
                  </Badge>
                  <div className="text-sm font-medium text-yellow-600">
                    +{achievement.points} pts
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* All Achievements */}
      <Card className="p-4">
        <h3 className="text-xl font-semibold mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                achievement.unlocked
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>
              <div className="flex-grow">
                <div className={`font-medium ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                  {achievement.title}
                </div>
                <div className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                  {achievement.description}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  className={`${getCategoryColor(achievement.category)} ${
                    achievement.unlocked ? '' : 'opacity-50'
                  }`}
                >
                  {getCategoryIcon(achievement.category)}
                  <span className="ml-1">{achievement.category}</span>
                </Badge>
                <div className={`text-sm font-medium ${
                  achievement.unlocked ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {achievement.points} pts
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProgressTracker;