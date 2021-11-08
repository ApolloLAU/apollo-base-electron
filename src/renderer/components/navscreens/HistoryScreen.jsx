import React, { useEffect, useState } from 'react';
import { Mission } from 'renderer/api/API';
import MissionCard from '../subcomponents/MissionCard';

export default function HistoryScreen() {
  const [missions, setMissions] = useState([]);
  const [listOfPatientLists, setPatientList] = useState([]);

  useEffect(() => {
    console.log('I AM HERE!');
    Mission.getCompletedMissions()
      .then((allMissions) => {
        setMissions(allMissions);
        return Promise.all(allMissions.map((m) => m.getPatients()));
      })
      .then((t) => {
        console.log(t);
        setPatientList(t);
      });
  }, []);

  return missions.length === listOfPatientLists.length ? (
    <div>
      <div>
        <h1>All Missions</h1>
        {missions.map((m, ind) => (
          <MissionCard
            missionID={m.id}
            missionDate={m.createdAt}
            missionLocation="location"
            patientName={
              listOfPatientLists[ind].length > 1
                ? 'Multiple Patients'
                : `${listOfPatientLists[ind][0].getFormattedName()}`
            }
            key={m.id}
          />
        ))}
      </div>
      <div>
        <h1>My Missions</h1>
      </div>
    </div>
  ) : (
    <div />
  );
}
