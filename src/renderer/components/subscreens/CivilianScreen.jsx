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
      <div className={styles.patientInfo}>
        <div className={styles.patientImage}>IMAGE GOES HERE</div>
        <div className={styles.patientData}>
          <p>First Name</p>
          <p>{civilian.getFirstName()}</p>
        </div>
        <div className={styles.patientData}>
          <p>Last Name</p>
          <p>{civilian.getLastName()}</p>
        </div>
        <div className={styles.patientData}>
          <p>Date of Birth</p>
          <p>{civilian.getDOB().toLocaleDateString()}</p>
        </div>
        <div className={styles.patientData}>
          <p>Sex</p>
          <p>{civilian.getSex()}</p>
        </div>
        <div className={styles.patientData}>
          <p>Address</p>
          <p>{civilian.getHomeAddress()}</p>
        </div>
        <div className={styles.patientData}>
          <p>Phone Number</p>
          <p>{civilian.getCellNbr()}</p>
        </div>
        <div className={styles.patientData}>
          <p>Emergency Contact</p>
          <p>{civilian.getEmergencyNbr()}</p>
        </div>
        <div className={styles.patientData}>
          <p>Blood Type</p>
          <p>{civilian.getBloodType()}</p>
        </div>
        <div className={styles.patientData}>
          <p>Weight</p>
          <p>{civilian.getWeight()}</p>
        </div>
        <div className={styles.patientData}>
          <p>Height</p>
          <p>{civilian.getHeight()}</p>
        </div>
        <div className={styles.patientData}>
          <p>Previous Heart Conditions</p>
          <input
            type="checkbox"
            disabled
            checked={civilian.getPrevConditions()}
          />
        </div>
      </div>
      <div>
        Mission History
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
