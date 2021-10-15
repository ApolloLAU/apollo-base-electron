import React, { useState } from 'react';

export default function CurrentMissionScreen() {
  const [currentMission, setCurrentMission] = useState(undefined);

  return currentMission !== undefined ? (
    <div>
      <h1>Current Mission</h1>
    </div>
  ) : (
    <div>
      <h1>No Active Mission</h1>
    </div>
  );
}
