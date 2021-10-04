import React from 'react';
import { useHistory } from 'react-router';

export default function MissionCard({
  missionID,
  missionLocation,
  missionDate,
  patientName,
}) {
  const history = useHistory();

  const onClick = () => history.push(`/main/history/${missionID}`);
  return (
    <div onClick={onClick} onKeyDown={onClick} role="button" tabIndex={0}>
      <h2>Mission {missionID}</h2>
      <h2>{missionDate.toLocaleDateString('en-GB')}</h2>
      <h2>{missionLocation}</h2>
      <h2>{patientName}</h2>
    </div>
  );
}
