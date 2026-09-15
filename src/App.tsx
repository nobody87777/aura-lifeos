import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Navbar, TabType } from './components/Navbar';
import { WhatShouldIDoNowModal } from './components/WhatShouldIDoNowModal';
import { DailyScoreModal } from './components/DailyScoreModal';
import { DeepWorkMode } from './components/DeepWorkMode';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { TasksScreen } from './screens/TasksScreen';
import { FocusScreen } from './screens/FocusScreen';
import { StudyScreen } from './screens/StudyScreen';
import { ProjectsScreen } from './screens/ProjectsScreen';
import { HealthScreen } from './screens/HealthScreen';
import { FinanceScreen } from './screens/FinanceScreen';
import { ReflectionScreen } from './screens/ReflectionScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const MainApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isSmartActionOpen, setIsSmartActionOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  // Deep work mode launcher state
  const [deepWorkTaskTitle, setDeepWorkTaskTitle] = useState('');
  const [deepWorkMinutes, setDeepWorkMinutes] = useState(25);
  const [isDeepWorkOpen, setIsDeepWorkOpen] = useState(false);

  const handleStartFocus = (title: string, durationMinutes: number) => {
    setDeepWorkTaskTitle(title);
    setDeepWorkMinutes(durationMinutes || 25);
    setIsDeepWorkOpen(true);
  };

  const renderScreen = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            onOpenSmartAction={() => setIsSmartActionOpen(true)}
            onOpenScoreBreakdown={() => setIsScoreModalOpen(true)}
            onStartFocus={handleStartFocus}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        );
      case 'tasks':
        return <TasksScreen onStartFocus={handleStartFocus} />;
      case 'focus':
        return <FocusScreen onStartDeepWork={handleStartFocus} />;
      case 'study':
        return <StudyScreen onStartFocus={handleStartFocus} />;
      case 'projects':
        return <ProjectsScreen onStartFocus={handleStartFocus} />;
      case 'health':
        return <HealthScreen />;
      case 'finance':
        return <FinanceScreen />;
      case 'reflection':
        return <ReflectionScreen />;
      case 'progress':
        return <ProgressScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return (
          <HomeScreen
            onOpenSmartAction={() => setIsSmartActionOpen(true)}
            onOpenScoreBreakdown={() => setIsScoreModalOpen(true)}
            onStartFocus={handleStartFocus}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Header */}
      <Header
        onOpenSmartAction={() => setIsSmartActionOpen(true)}
        onOpenScoreBreakdown={() => setIsScoreModalOpen(true)}
      />

      {/* Navigation (Desktop subheader & Mobile bottom bar) */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSmartAction={() => setIsSmartActionOpen(true)}
      />

      {/* Active Screen Body */}
      <main className="flex-1 w-full animate-fadeIn">
        {renderScreen()}
      </main>

      {/* Decision Fatigue Engine Modal */}
      <WhatShouldIDoNowModal
        isOpen={isSmartActionOpen}
        onClose={() => setIsSmartActionOpen(false)}
        onStartFocus={handleStartFocus}
      />

      {/* Explainable Daily Score Modal */}
      <DailyScoreModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
      />

      {/* Fullscreen Deep Work Mode */}
      <DeepWorkMode
        isOpen={isDeepWorkOpen}
        taskTitle={deepWorkTaskTitle}
        initialMinutes={deepWorkMinutes}
        onClose={() => setIsDeepWorkOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
