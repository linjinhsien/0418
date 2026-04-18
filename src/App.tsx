import React, { useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Layout } from './components/Layout';
import ClimbForm from './climbs/ClimbForm';
import ClimbList from './climbs/ClimbList';
import Dashboard from './dashboard/Dashboard';
import SuggestionsScreen from './suggestions/SuggestionsScreen';
import ProfileScreen from './profile/ProfileScreen';

type Tab = 'climbs' | 'dashboard' | 'suggestions' | 'profile';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('climbs');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <APIProvider 
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      version="beta"
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <Layout activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as Tab)}>
        {activeTab === 'climbs' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <ClimbForm onSaved={() => setRefreshTrigger(n => n + 1)} />
            <ClimbList refreshTrigger={refreshTrigger} />
          </div>
        )}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'suggestions' && <SuggestionsScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </Layout>
    </APIProvider>
  );
}

export default App;
