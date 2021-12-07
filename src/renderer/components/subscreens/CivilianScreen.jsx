import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Mission, Patient } from '../../api/API';
import styles from './css/CivilianScreen.module.css';
import MissionCard from '../subcomponents/MissionCard';

export default function CivilianScreen() {
  const { id } = useParams();
  const [civilian, setCivilian] = useState(undefined);
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    Patient.getById(id).then(async (p) => {
      if (p) {
        setCivilian(p);
        setMissions(await Mission.getMissionsForCivilian(p));
      }
    });
  }, []);

  return civilian ? (
    <div>
      <h1>Patient Personal Information</h1>
      <div className={styles.patientInfo}>
        <div className={styles.patientData}>
          <p className={styles.dataLabel}>First Name: </p>
          <p>{civilian.getFirstName()}</p>
        </div>
        <div className={styles.patientData}>
          <p className={styles.dataLabel}>Last Name: </p>
          <p>{civilian.getLastName()}</p>
        </div>
        <div className={styles.patientData}>
          <p className={styles.dataLabel}>Date of Birth: </p>
          <p>{civilian.getDOB().toLocaleDateString()}</p>
        </div>
        <div className={styles.patientData}>
          <p className={styles.dataLabel}>Sex:</p>
          <p>{civilian.getSex()}</p>
        </div>
        <div className={styles.patientData}>
          <p className={styles.dataLabel}>Address: </p>
          <p>{civilian.getHomeAddress()}</p>
        </div>
        <div className={styles.patientData}>
          <p className={styles.dataLabel}>Phone Number:</p>
          <p>{civilian.getCellNbr()}</p>
        </div>
        <div className={styles.patientData}>
          <p className={styles.dataLabel}>Emergency Contact: </p>
          <p>{civilian.getEmergencyNbr()}</p>
        </div>
        <div className={styles.patientData}>
          <p className={styles.dataLabel}>Blood Type: </p>
          <p>{civilian.getBloodType()}</p>
        </div>
        <div className={styles.patientData}>
          <p className={styles.dataLabel}>Weight: </p>
          <p>{civilian.getWeight()}</p>
        </div>
        <div className={styles.patientData}>
          <p className={styles.dataLabel}>Height: </p>
          <p>{civilian.getHeight()}</p>
        </div>
        <div className={styles.patientData}>
          <p className={styles.dataLabel}>Previous Heart Conditions: </p>
          <p>{civilian.getPrevConditions() ? 'YES' : 'NO'}</p>
        </div>
      </div>
      <div>
        <h1>Mission History</h1>
        {missions.map((m) => (
          <MissionCard
            missionID={m.id}
            patientName={m.formatPatientNames()}
            missionDate={m.createdAt}
            missionLocation={m.getFormattedLocation()}
          />
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
}
