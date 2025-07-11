import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  MessageCircle,
  FolderPlus,
  Settings,
  Plus,
  ArrowRight,
} from "lucide-react";

const notifications = [
  { text: "Uploaded new project", time: "2 hours ago", type: "upload" },
  { text: "Updated E-commerce", time: "4 hours ago", type: "update" },
  { text: "A member messaged you", time: "6 hours ago", type: "message" },
  { text: "Uploaded new project", time: "1 day ago", type: "upload" },
  { text: "Updated E-commerce", time: "2 days ago", type: "update" },
  { text: "A member messaged you", time: "3 days ago", type: "message" },
];

const projects = [
  { name: "Bus management system", status: "active", progress: 85 },
  { name: "E-commerce", status: "review", progress: 100 },
  { name: "Online booking", status: "active", progress: 60 },
];

const messages = [
  {
    name: "Sam Rwanda",
    text: "Hello, are you there?",
    time: "5m ago",
    avatar: "SR",
    online: true,
  },
  {
    name: "ALAN",
    text: "Hello, are you there?",
    time: "1h ago",
    avatar: "AL",
    online: false,
  },
  {
    name: "Peace",
    text: "Hello, are you there?",
    time: "2h ago",
    avatar: "PE",
    online: true,
  },
];

const getStatusColor = (status: string): string => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "review":
      return "bg-yellow-100 text-yellow-800";
    case "planning":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getNotificationIcon = (type: string): React.ReactNode => {
  switch (type) {
    case "upload":
      return <FolderPlus className="w-4 h-4" />;
    case "update":
      return <Settings className="w-4 h-4" />;
    case "message":
      return <MessageCircle className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, Sam! Here's what's happening with your projects today.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                SR
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Sam Rwanda
            </h3>
            <p className="text-sm text-gray-600 mb-4">Full Stack Developer</p>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => navigate("/dashboard/edit-profile")}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Edit Profile
              </button>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Add Resource
              </button>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="lg:col-span-2 xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Projects
            </h3>
            <button
              onClick={() => navigate("/dashboard/projects")}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <FolderPlus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {project.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                      >
                        {project.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {project.progress}% complete
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-3 xl:col-span-1 grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-1 gap-4">
          <div
            onClick={() => navigate("/dashboard/projects/new")}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
                <Plus className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="font-medium text-gray-900">Add Project</h4>
              <p className="text-sm text-gray-500 mt-1">Create a new project</p>
            </div>
          </div>

          <div
            onClick={() => navigate("/dashboard/projects")}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900">Manage Projects</h4>
              <p className="text-sm text-gray-500 mt-1">Organize your work</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="lg:col-span-1 xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Notifications
            </h3>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              Mark all read
            </button>
          </div>
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="lg:col-span-2 xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
            <button
              onClick={() => navigate("/hub-channel")}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {message.avatar}
                  </div>
                  {message.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      {message.name}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {message.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
