import React from 'react';
import { useHistory } from 'react-router';

import './css/MissionCard.css';

export default function MissionCard({
  missionID,
  missionLocation,
  missionDate,
  patientName,
  onClck,
}) {
  const history = useHistory();

  const onClick = onClck || (() => history.push(`/main/history/${missionID}`));
  return (
    <div onClick={onClick} onKeyDown={onClick} role="button" tabIndex={0} className="mission-card">
      <p>
        ID: {missionID} - {missionDate.toLocaleDateString('en-GB')}
      </p>
      <p>{missionLocation}</p>
      <p>{patientName}</p>
    </div>
  );
}
