import React from 'react';
import { useParams } from 'react-router';

export default function DeployMissionScreen() {
  const { id } = useParams();

  return <h1>DEPLOYING MISSION</h1>;
}
