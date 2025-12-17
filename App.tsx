
import React, { useState } from 'react';
import Layout from './components/Layout';
import MentorChat from './components/MentorChat';
import CareerExplorer from './components/CareerExplorer';
import ExamMaster from './components/ExamMaster';
import CampusFinder from './components/CampusFinder';
import InterestTest from './components/InterestTest';
import MindDiscovery from './components/MindDiscovery';
import IndiaHub from './components/IndiaHub';
import Comparison from './components/Comparison';
import Dashboard from './components/Dashboard';
import { ToolType } from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.DASHBOARD);

  const renderTool = () => {
    switch (activeTool) {
      case ToolType.DASHBOARD:
        return <Dashboard onNavigate={setActiveTool} />;
      case ToolType.MIND_DISCOVERY:
        return <MindDiscovery />;
      case ToolType.INTEREST_TEST:
        return <InterestTest />;
      case ToolType.INDIA_HUB:
        return <IndiaHub />;
      case ToolType.COMPARISON:
        return <Comparison />;
      case ToolType.MENTOR:
        return <MentorChat />;
      case ToolType.EXPLORER:
        return <CareerExplorer />;
      case ToolType.EXAMS:
        return <ExamMaster />;
      case ToolType.MAPS:
        return <CampusFinder />;
      default:
        return <Dashboard onNavigate={setActiveTool} />;
    }
  };

  return (
    <Layout activeTool={activeTool} setActiveTool={setActiveTool}>
      {renderTool()}
    </Layout>
  );
};

export default App;
