import React, { useEffect, useState } from 'react';
import Header from './Header';
import MapViewer from '../MapViewer/MapViewer';
import AddSensorModal from './AddSensorModal';
import EditSensorModal from './EditSensorModal';

const Dashboard = ({ user, onLogout }) => {
  const [sensors, setSensors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [areas, setAreas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editSensor, setEditSensor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // הבאת חדרים
      const roomsRes = await fetch('http://localhost:3000/api/rooms');
      const roomsData = await roomsRes.json();
      if (roomsData.success) setRooms(roomsData.data);

      // הבאת חיישנים
      const sensorsRes = await fetch('http://localhost:3000/api/sensors', {
        headers: {
          'username': user.credentials.username,
          'password': user.credentials.password
        }
      });
      const sensorsData = await sensorsRes.json();
      if (sensorsData.success) setSensors(sensorsData.data);

      // הבאת כל האזורים
      const areasRes = await fetch('http://localhost:3000/api/areas');
      const areasData = await areasRes.json();
      if (areasData.success) setAreas(areasData.data);

    } catch (error) {
      console.error('Error:', error);
      setMessage('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSensor = async (newSensor) => {
    // פונקציה להוספת חיישן חדש
  };

  const handleUpdateSensor = async (updatedSensor) => {
    // פונקציה לעדכון חיישן קיים
  };

  return (
    <div className="dashboard">
      <Header user={user} onLogout={onLogout} />
      <main className="dashboard-main">
        <MapViewer user={user} />
      </main>

      <AddSensorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddSensor}
        rooms={rooms}
        sensors={sensors} // הוסיפי שורה זו
      />

      <EditSensorModal
        isOpen={!!editSensor}
        onClose={() => setEditSensor(null)}
        onSave={handleUpdateSensor}
        sensor={editSensor}
        rooms={rooms}
        sensors={sensors} // הוסיפי שורה זו
      />
    </div>
  );
};

const AddSensorModal = ({ isOpen, onClose, onSave, rooms, sensors }) => {
  // ...existing code...
};

const EditSensorModal = ({ isOpen, onClose, onSave, sensor, rooms, sensors }) => {
  // ...existing code...
};

export default Dashboard;