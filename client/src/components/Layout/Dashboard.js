import React from 'react';
import Header from './Header';
import MapViewer from '../MapViewer/MapViewer';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="dashboard">
      <Header user={user} onLogout={onLogout} />
      <main className="dashboard-main">
        <MapViewer user={user} />
      </main>
    </div>
  );
};

export default Dashboard;