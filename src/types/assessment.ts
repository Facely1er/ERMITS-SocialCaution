export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export type Answer = {
  value: string;
  score: number;
  level: UserLevel;
};

type Standard = {
  name: string;
  description: string;
};

export type Question = {
  id: string;
  text: string;
  category: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  criticality: number;
  complexity: number;
  icon: React.ElementType;
  options: {
    text: string;
    value: string;
    score: number;
    level: UserLevel;
  }[];
  standards?: Standard[];
};

type ActionItem = {
  title: string;
  timeframe: string;
  steps: string[];
  resources: {
    title: string;
    url: string;
  }[];
  icon: React.ElementType;
  priority: number;
  category: string;
  questionId: string;
  criticality: number;
  complexity: number;
};

export type AssessmentResults = {
  score: number;
  maxScore: number;
  percentage: number;
  actionPlan: ActionItem[];
  userLevel: UserLevel;
};