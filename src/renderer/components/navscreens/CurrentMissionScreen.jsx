import React, { useState, useEffect } from 'react';
import { API, Mission } from 'renderer/api/API';

export default function CurrentMissionScreen() {
  const [currentMission, setCurrentMission] = useState(null);

  useEffect(() => {
    API.getWorkerForUser(API.getLoggedInUser())
      .then((currentWorker) => Mission.getWorkerActiveMission(currentWorker))
      .then((cMission) => setCurrentMission(cMission));
  }, []);

  return currentMission !== null ? (
    <div>
      <h1>Current Mission</h1>
    </div>
  ) : (
    <div>
      <h1>No Active Mission</h1>
    </div>
  );
}
