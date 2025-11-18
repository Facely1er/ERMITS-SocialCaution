import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  Trophy, 
  Target, 
  Play,
  RotateCcw,
  Star,
  Award,
  Zap,
  Shield,
  Users,
  BookOpen,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Search,
  Lightbulb,
  Bell,
  ArrowRight,
  Map
} from 'lucide-react';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useThirtyDayChallengeStore } from '../store/thirtyDayChallengeStore';
import { useProgressStore } from '../store/progressStore';
import { supabase, isSupabaseAvailable } from '../lib/supabase';
import { Link } from 'react-router-dom';
const ThirtyDayRoadmapPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const {
    startDate,
    totalPoints,
    dailyTasks,
    milestones,
    achievements,
    startChallenge,
    completeTask,
    resetChallenge,
    getProgressPercentage,
    getStreakDays,
    loadChallenge,
    syncWithBackend
  } = useThirtyDayChallengeStore();

  const { addPoints, checkThirtyDayAchievements } = useProgressStore();

  // Check authentication status and load challenge data
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        if (!isSupabaseAvailable()) {
          setIsAuthenticated(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);

        if (user) {
          await loadChallenge(user.id);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuthAndLoadData();
  }, [loadChallenge]);

  const progressPercentage = getProgressPercentage();
  const streakDays = getStreakDays();
  const isChallengeActive = startDate !== null;

  // Get tasks for selected day
  const selectedDayTasks = dailyTasks.filter(task => task.day === selectedDay);
  const completedTasks = dailyTasks.filter(task => task.completed);
  const completedTasksCount = completedTasks.length;

  // Get week tasks
  const getWeekTasks = (week: number) => {
    const startDay = (week - 1) * 7 + 1;
    const endDay = Math.min(week * 7, 30);
    return dailyTasks.filter(task => task.day >= startDay && task.day <= endDay);
  };

  const getWeekProgress = (week: number) => {
    const weekTasks = getWeekTasks(week);
    const completedWeekTasks = weekTasks.filter(task => task.completed).length;
    return Math.round((completedWeekTasks / weekTasks.length) * 100);
  };

  const handleStartChallenge = async () => {
    try {
      await startChallenge();
      addPoints(50, 'challenge-start');
      checkThirtyDayAchievements(0, true);
      
      if (isAuthenticated && isSupabaseAvailable()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await syncWithBackend(user.id);
        }
      }
    } catch (error) {
      console.error('Failed to start challenge:', error);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
      addPoints(20, 'task-completion');
      checkThirtyDayAchievements(completedTasksCount + 1, true);

      if (isAuthenticated && isSupabaseAvailable()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await syncWithBackend(user.id);
        }
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const handleResetChallenge = async () => {
    if (window.confirm('Are you sure you want to reset your 30-day challenge progress?')) {
      try {
        await resetChallenge();

        if (isAuthenticated && isSupabaseAvailable()) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await syncWithBackend(user.id);
          }
        }
      } catch (error) {
        console.error('Failed to reset challenge:', error);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'password': return Shield;
      case 'browser': return Target;
      case 'social': return Users;
      case 'device': return Zap;
      case 'data': return BookOpen;
      case 'privacy-settings': return Shield;
      case 'education': return BookOpen;
      case 'tools': return Target;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'password': return 'bg-blue-500';
      case 'browser': return 'bg-green-500';
      case 'social': return 'bg-purple-500';
      case 'device': return 'bg-orange-500';
      case 'data': return 'bg-red-500';
      case 'privacy-settings': return 'bg-indigo-500';
      case 'education': return 'bg-pink-500';
      case 'tools': return 'bg-teal-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary to-accent text-white pt-32 pb-20 relative overflow-hidden">
        {/* Enhanced background overlay for better text contrast */}
        <div className="absolute inset-0 bg-primary/80 dark:bg-primary/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/20"></div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center mb-6">
                <Map className="h-8 w-8 mr-3 text-white drop-shadow-lg" />
                <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                  30-Day Privacy Challenge
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-6 text-white/95 drop-shadow-md">
                Complete daily privacy tasks to improve your privacy score
              </p>
              <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-sm">
                A comprehensive, day-by-day implementation of your privacy journey's "Protect" phase. Transform your digital privacy with guided daily actions.
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Privacy Journey Phase Indicators - Fixed positioning and spacing */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-lg">
            <div className="flex items-center gap-2 text-white/90">
              <Search className="h-4 w-4" />
              <span className="text-sm font-medium">Discover</span>
            </div>
            <div className="w-6 h-px bg-white/40"></div>
            <div className="flex items-center gap-2 text-white/90">
              <Lightbulb className="h-4 w-4" />
              <span className="text-sm font-medium">Learn</span>
            </div>
            <div className="w-6 h-px bg-white/40"></div>
            <div className="flex items-center gap-2 text-white font-semibold">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Protect</span>
            </div>
            <div className="w-6 h-px bg-white/40"></div>
            <div className="flex items-center gap-2 text-white/90">
              <Bell className="h-4 w-4" />
              <span className="text-sm font-medium">Monitor</span>
            </div>
          </div>
        </div>
      </div>

      <Section>
        {/* Privacy Journey Integration */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">
                Your Privacy Journey: Protect Phase
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                This 30-day plan is the structured implementation of your privacy journey's "Protect" phase. 
                After discovering your vulnerabilities and learning about privacy rights, it's time to take action.
              </p>
            </div>
            
            {/* Journey Phase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 text-center bg-white dark:bg-card border border-border hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mx-auto mb-3 shadow-md">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-primary dark:text-white mb-2">Discover</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Assess your privacy vulnerabilities</p>
                <Link to="/assessment">
                  <Button variant="outline" size="sm" className="mt-2">
                    Take Assessment
                  </Button>
                </Link>
              </Card>
              
              <Card className="p-4 text-center bg-white dark:bg-card border border-border hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white mx-auto mb-3 shadow-md">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-primary dark:text-white mb-2">Learn</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Understand privacy rights and options</p>
                <Link to="/resources">
                  <Button variant="outline" size="sm" className="mt-2">
                    Explore Resources
                  </Button>
                </Link>
              </Card>
              
              <Card className="p-4 text-center bg-accent/10 dark:bg-accent/20 border-2 border-accent shadow-md hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-3 shadow-md">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-primary dark:text-white mb-2">Protect</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Implement privacy measures (30-day plan)</p>
                <Button variant="primary" size="sm" className="mt-2" onClick={handleStartChallenge}>
                  Start Plan
                </Button>
              </Card>
              
              <Card className="p-4 text-center bg-white dark:bg-card border border-border hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white mx-auto mb-3 shadow-md">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-primary dark:text-white mb-2">Monitor</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Track progress and maintain protection</p>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="mt-2">
                    View Dashboard
                  </Button>
                </Link>
              </Card>
            </div>
          </Card>
        </div>

        {/* Challenge Status */}
        <div className="mb-8">
          <Card className="p-6 bg-white dark:bg-card border border-border shadow-sm">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">
                  {isChallengeActive ? 'Your 30-Day Protection Plan' : 'Start Your 30-Day Protection Plan'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {isChallengeActive 
                    ? `You've completed ${completedTasksCount} out of 30 protection tasks. Keep building your privacy fortress!`
                    : 'Take control of your digital privacy with our structured 30-day protection plan. Each day brings a new privacy task designed to strengthen your online security.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {!isChallengeActive ? (
                    <Button variant="primary" onClick={handleStartChallenge} className="shadow-md hover:shadow-lg">
                      <Play className="mr-2 h-4 w-4" />
                      Start Protection Plan
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={handleResetChallenge} className="border-border hover:bg-card-hover">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset Plan
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="lg:w-1/2">
                {isChallengeActive && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-accent/10 dark:bg-accent/20 rounded-lg border border-accent/20 shadow-sm">
                      <div className="text-2xl font-bold text-accent">{progressPercentage}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Complete</div>
                    </div>
                    <div className="text-center p-4 bg-accent/10 dark:bg-accent/20 rounded-lg border border-accent/20 shadow-sm">
                      <div className="text-2xl font-bold text-accent">{streakDays}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Days Active</div>
                    </div>
                    <div className="text-center p-4 bg-accent/10 dark:bg-accent/20 rounded-lg border border-accent/20 shadow-sm">
                      <div className="text-2xl font-bold text-accent">{totalPoints}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Points Earned</div>
                    </div>
                    <div className="text-center p-4 bg-accent/10 dark:bg-accent/20 rounded-lg border border-accent/20 shadow-sm">
                      <div className="text-2xl font-bold text-accent">{completedTasksCount}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Tasks Done</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Overview */}
        {isChallengeActive && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">
              Your Progress Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(week => (
                <Card key={week} className="p-4 bg-white dark:bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary dark:text-white mb-2">
                      Week {week}
                    </div>
                    <div className="text-2xl font-bold text-accent mb-2">
                      {getWeekProgress(week)}%
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2 overflow-hidden">
                      <motion.div 
                        className="bg-accent h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${getWeekProgress(week)}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {getWeekTasks(week).filter(task => task.completed).length} / {getWeekTasks(week).length} tasks
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Milestones */}
        {isChallengeActive && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">
              Milestones
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { day: 7, label: 'Week 1', milestone: milestones.day7 },
                { day: 14, label: 'Week 2', milestone: milestones.day14 },
                { day: 21, label: 'Week 3', milestone: milestones.day21 },
                { day: 30, label: 'Complete', milestone: milestones.day30 }
              ].map(({ day, label, milestone }) => (
                <Card key={day} className={`p-4 text-center bg-white dark:bg-card border border-border shadow-sm hover:shadow-md transition-all duration-200 ${
                  milestone ? 'bg-accent/10 dark:bg-accent/20 border-accent shadow-md' : ''
                }`}>
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center shadow-md ${
                    milestone ? 'bg-accent text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                    {milestone ? <Trophy className="h-6 w-6" /> : <Target className="h-6 w-6" />}
                  </div>
                  <div className="font-semibold text-primary dark:text-white">{label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Day {day}</div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Daily Tasks */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary dark:text-white">
              Daily Tasks
            </h2>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button
                variant={showCompletedOnly ? "primary" : "outline"}
                onClick={() => setShowCompletedOnly(!showCompletedOnly)}
                size="sm"
                className={showCompletedOnly ? "shadow-sm hover:shadow-md" : "border-border hover:bg-card-hover"}
              >
                {showCompletedOnly ? 'Show All' : 'Show Completed'}
              </Button>
            </div>
          </div>

          {/* Day Navigation */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
              disabled={selectedDay === 1}
              size="sm"
              className="border-border hover:bg-card-hover"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 py-2 bg-accent/10 dark:bg-accent/20 rounded-lg border border-accent/20 shadow-sm">
              <span className="font-semibold text-primary dark:text-white">Day {selectedDay}</span>
            </div>
            <Button
              variant="outline"
              onClick={() => setSelectedDay(Math.min(30, selectedDay + 1))}
              disabled={selectedDay === 30}
              size="sm"
              className="border-border hover:bg-card-hover"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Tasks for Selected Day */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedDayTasks
              .filter(task => !showCompletedOnly || task.completed)
              .map((task) => {
                const CategoryIcon = getCategoryIcon(task.category);
                return (
                  <Card key={task.id} className={`p-4 bg-white dark:bg-card border border-border shadow-sm hover:shadow-md transition-all duration-200 ${
                    task.completed ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 ${getCategoryColor(task.category)} rounded-full flex items-center justify-center text-white shadow-md`}>
                        <CategoryIcon className="h-5 w-5" />
                      </div>
                      {task.completed && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-primary dark:text-white mb-2">
                      {task.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      {task.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                        {task.difficulty}
                      </span>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {task.estimatedTime}
                      </div>
                    </div>

                    {!task.completed && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleCompleteTask(task.id)}
                        className="w-full shadow-sm hover:shadow-md"
                      >
                        Mark Complete
                      </Button>
                    )}

                    {task.resources && task.resources.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Resources:
                        </div>
                        <div className="space-y-1">
                          {task.resources.map((resource, index) => (
                            <a
                              key={index}
                              href={resource.url}
                              className="flex items-center text-xs text-accent hover:text-accent/80 transition-colors duration-200"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {resource.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {task.tips && task.tips.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Tips:
                        </div>
                        <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                          {task.tips.map((tip, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-accent mr-1">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                );
              })}
          </div>
        </div>

        {/* Achievements */}
        {isChallengeActive && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">
              Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 'firstWeek', title: 'First Week', description: 'Complete your first week', icon: Star, unlocked: achievements.firstWeek },
                { id: 'secondWeek', title: 'Second Week', description: 'Complete your second week', icon: Award, unlocked: achievements.secondWeek },
                { id: 'thirdWeek', title: 'Third Week', description: 'Complete your third week', icon: Trophy, unlocked: achievements.thirdWeek },
                { id: 'privacyMaster', title: 'Privacy Master', description: 'Complete all 30 days', icon: Shield, unlocked: achievements.privacyMaster },
                { id: 'streakKeeper', title: 'Streak Keeper', description: 'Maintain a 7-day streak', icon: Zap, unlocked: achievements.streakKeeper }
              ].map(({ id, title, description, icon: Icon, unlocked }) => (
                <Card key={id} className={`p-4 text-center bg-white dark:bg-card border border-border shadow-sm hover:shadow-md transition-all duration-200 ${
                  unlocked ? 'bg-accent/10 dark:bg-accent/20 border-accent shadow-md' : ''
                }`}>
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center shadow-md ${
                    unlocked ? 'bg-accent text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="font-semibold text-primary dark:text-white">{title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{description}</div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        {!isChallengeActive && (
          <div className="text-center">
            <Card className="p-8 bg-accent text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white">Ready to Protect Your Digital Life?</h2>
              <p className="text-lg mb-6 text-white/95">
                Complete your privacy journey by implementing the "Protect" phase with our structured 30-day plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" className="bg-white text-accent hover:bg-gray-100 shadow-md hover:shadow-lg" onClick={handleStartChallenge}>
                  <Shield className="mr-2 h-5 w-5" />
                  Start Protection Plan
                </Button>
                <Link to="/privacy-journey">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 shadow-md hover:shadow-lg">
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Learn About Privacy Journey
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </Section>
    </>
  );
};

export { ThirtyDayRoadmapPage };
export default ThirtyDayRoadmapPage;
