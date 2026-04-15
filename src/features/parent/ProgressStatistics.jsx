import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Calendar,
  Award,
  Target,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import { useAuthStore } from "../../store";

export default function ProgressStatistics() {
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState("month");

  const [overallStats] = useState({
    totalSessions: 48,
    completedSessions: 42,
    averageProgress: 78,
    skillsImproved: 12,
    currentStreak: 8,
    bestStreak: 15,
  });

  const [skillProgress] = useState([
    {
      skill: "Communication",
      baseline: 45,
      current: 85,
      target: 90,
      sessions: 24,
      trend: "up",
    },
    {
      skill: "Social Skills",
      baseline: 52,
      current: 72,
      target: 80,
      sessions: 20,
      trend: "up",
    },
    {
      skill: "Motor Skills",
      baseline: 38,
      current: 68,
      target: 75,
      sessions: 18,
      trend: "up",
    },
    {
      skill: "Cognitive",
      baseline: 60,
      current: 90,
      target: 85,
      sessions: 22,
      trend: "up",
    },
    {
      skill: "Emotional Regulation",
      baseline: 55,
      current: 78,
      target: 85,
      sessions: 16,
      trend: "up",
    },
    {
      skill: "Independence",
      baseline: 40,
      current: 65,
      target: 70,
      sessions: 14,
      trend: "stable",
    },
  ]);

  const [monthlyData] = useState([
    { month: "Jan", progress: 65, sessions: 8 },
    { month: "Feb", progress: 68, sessions: 10 },
    { month: "Mar", progress: 72, sessions: 12 },
    { month: "Apr", progress: 75, sessions: 14 },
    { month: "May", progress: 78, sessions: 16 },
    { month: "Jun", progress: 82, sessions: 18 },
  ]);

  const [achievements] = useState([
    {
      id: 1,
      title: "First Milestone",
      description: "Completed first therapy session",
      date: "Jan 15, 2024",
      icon: Award,
    },
    {
      id: 2,
      title: "Communication Breakthrough",
      description: "Improved verbal communication by 40%",
      date: "Mar 10, 2024",
      icon: Target,
    },
    {
      id: 3,
      title: "Social Skills Champion",
      description: "Successfully participated in group activities",
      date: "Apr 22, 2024",
      icon: Activity,
    },
    {
      id: 4,
      title: "Consistency Award",
      description: "8-day therapy session streak",
      date: "May 30, 2024",
      icon: TrendingUp,
    },
  ]);

  const [sessionTypes] = useState([
    { type: "Speech Therapy", count: 18, percentage: 38, color: "bg-blue-500" },
    {
      type: "Behavioral Therapy",
      count: 12,
      percentage: 25,
      color: "bg-green-500",
    },
    {
      type: "Occupational Therapy",
      count: 10,
      percentage: 21,
      color: "bg-purple-500",
    },
    {
      type: "Physical Therapy",
      count: 8,
      percentage: 16,
      color: "bg-orange-500",
    },
  ]);

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Progress Statistics
          </h1>
          <p className="text-gray-600 mt-1">
            Track {user?.name}&apos;s therapy journey and achievements
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("week")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              timeRange === "week"
                ? "bg-primary-100 text-primary-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              timeRange === "month"
                ? "bg-primary-100 text-primary-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeRange("year")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              timeRange === "year"
                ? "bg-primary-100 text-primary-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            This Year
          </button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Sessions
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.completedSessions}/{overallStats.totalSessions}
              </p>
              <p className="text-xs text-green-600">
                {Math.round(
                  (overallStats.completedSessions /
                    overallStats.totalSessions) *
                    100,
                )}
                % completion rate
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Average Progress
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.averageProgress}%
              </p>
              <p className="text-xs text-green-600">+12% from baseline</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Skills Improved
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.skillsImproved}
              </p>
              <p className="text-xs text-purple-600">Across all areas</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Current Streak
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.currentStreak} days
              </p>
              <p className="text-xs text-gray-500">
                Best: {overallStats.bestStreak} days
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Progress */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Skill Development Progress
          </h2>
          <div className="space-y-4">
            {skillProgress.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{skill.skill}</p>
                    <p className="text-sm text-gray-600">
                      {skill.sessions} sessions - Target: {skill.target}%
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {skill.current}%
                    </span>
                    <p className="text-xs text-green-600">
                      +{skill.current - skill.baseline}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${skill.current}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Baseline: {skill.baseline}%</span>
                  <span
                    className={`flex items-center ${
                      skill.trend === "up" ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {skill.trend === "up" && (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    )}
                    {skill.trend === "up" ? "Improving" : "Stable"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Progress Chart */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Monthly Progress Trend
          </h2>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {data.month}
                  </span>
                  <div className="ml-4 flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${data.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <span className="text-sm font-medium text-gray-900">
                    {data.progress}%
                  </span>
                  <p className="text-xs text-gray-500">
                    {data.sessions} sessions
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Session Types Distribution */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Therapy Session Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sessionTypes.map((session, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div
                className={`w-12 h-12 ${session.color} rounded-lg flex items-center justify-center mx-auto mb-3`}
              >
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium text-gray-900">{session.type}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {session.count}
              </p>
              <p className="text-sm text-gray-600">
                {session.percentage}% of total
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Achievements & Milestones
          </h2>
          <Link
            to="/parent/feedback"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg"
            >
              <div className="p-3 bg-primary-100 rounded-lg mr-4">
                <achievement.icon className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{achievement.title}</p>
                <p className="text-sm text-gray-600">
                  {achievement.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goals & Next Steps */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Goals & Next Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">
              Short-term Goals (Next 3 months)
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">
                  Improve verbal communication skills
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">
                  Enhance social interaction abilities
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">
                  Develop better emotional regulation
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-3">
              Recommended Next Steps
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-primary-600 mr-3" />
                <span className="text-sm text-gray-700">
                  Schedule follow-up assessment
                </span>
              </div>
              <div className="flex items-center">
                <Target className="w-4 h-4 text-primary-600 mr-3" />
                <span className="text-sm text-gray-700">
                  Update individualized education plan
                </span>
              </div>
              <div className="flex items-center">
                <Activity className="w-4 h-4 text-primary-600 mr-3" />
                <span className="text-sm text-gray-700">
                  Continue intensive therapy sessions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
