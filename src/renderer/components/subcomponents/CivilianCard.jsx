import React from 'react';
import { useHistory } from 'react-router';

import './css/MissionCard.css';

export default function CivilianCard({
  patientId,
  patientName,
  sex,
  dob,
  address,
}) {
  const history = useHistory();

  const onClick = () => history.push(`/main/records/${patientId}`);
  const getAge = () => {
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);

    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex={0}
      className="mission-card"
    >
      <p>{patientName}</p>
      <p>
        {sex}, {getAge()} Years
      </p>
      <p>{address}</p>
    </div>
  );
}
