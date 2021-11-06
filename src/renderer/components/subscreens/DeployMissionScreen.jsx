import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { API, Mission, MWorker } from '../../api/API';

import styles from './css/DeployMission.module.css';
import SelectableWorkerCard from '../subcomponents/SelectableWorkerCard';

export default function DeployMissionScreen() {
  const { id } = useParams();
  const [currentMission, setCurrentMission] = useState(undefined);
  const [fieldWorkers, setFieldWorkers] = useState([]);
  const [subscription, setSubscription] = useState(undefined);
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [initialInfo, setInitialInfo] = useState('');

  useEffect(() => {
    Mission.getByID(id)
      .then((m) => m.fetch())
      .then((m) => setCurrentMission(m));

    const user = API.getLoggedInUser();
    if (user) {
      API.getWorkerForUser(user)
        .then((w) => {
          if (w) {
            return w.fetch();
          }
          throw new Error('Worker does not exist');
        })
        .then((w) => {
          const d = w.getDistrict();
          const query = MWorker.getFieldWorkerQuery(d);
          return query;
        })
        .then(async (q) => {
          await q.find().then((workers) => setFieldWorkers(workers));
          return q.subscribe();
        })
        .then((sub) => setSubscription(sub));
    }
  }, []);

  useEffect(() => {
    if (subscription) {
      subscription.on('update', (w) => {
        setFieldWorkers([...fieldWorkers.filter((w2) => w2.id !== w.id), w]);
      });
    }
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [subscription]);

  if (currentMission === undefined) {
    return <div />;
  }

  const onTextEntered = (e) => {
    setInitialInfo(e.target.value);
  };

  const onWorkerClicked = (worker) => {
    return (isSelected) => {
      const foundWorker = selectedWorkers.find((w) => w.id === worker.id);
      if (foundWorker !== undefined || !isSelected) {
        setSelectedWorkers([
          selectedWorkers.filter((w) => w.id !== foundWorker),
        ]);
      } else if (isSelected) {
        setSelectedWorkers([...selectedWorkers, worker]);
      }
    };
  };

  const onDeployMission = (e) => {
    e.preventDefault();

    if (currentMission && selectedWorkers.length > 0) {
      selectedWorkers.forEach((worker) => {
        worker.setStatus('busy');
        currentMission.addFieldWorker(worker);
      });
      const user = API.getLoggedInUser();
      if (user) {
        API.getWorkerForUser(user).then((w) => {
          currentMission.addBaseWorker(w);
          currentMission.setInitialDesc(initialInfo);
          return currentMission.save();
        });
      }
    }
  };

  return (
    <div>
      <div className={styles.missionInfo}>
        <div className={styles.infoArea}>
          <label className={styles.infoLabel}>Mission ID</label>
          <input disabled type="text" value={id} className={styles.idInput} />
        </div>
        <div className={styles.infoArea}>
          <label className={styles.infoLabel}>Patients:</label>
          <div>
            <p>{currentMission.formatPatientNames()}</p>
            <button type="button">Edit Patient Information</button>
          </div>
        </div>
        <div className={styles.infoArea}>
          <label className={styles.infoLabel}>Initial Description</label>
          <textarea
            className={styles.descArea}
            value={initialInfo}
            onChange={onTextEntered}
          />
        </div>
      </div>
      <div>
        <h2>Field Team Members</h2>
        <div>
          {fieldWorkers.map((f) => (
            <SelectableWorkerCard
              imgSrc={f.getImgURL() !== '' ? f.getImgURL() : undefined}
              name={f.getFormattedName()}
              status={f.getStatus()}
              setSelected={onWorkerClicked(f)}
              isSelected={selectedWorkers.includes(f)}
            />
          ))}
        </div>
      </div>
      <button type="button" onClick={onDeployMission}>
        Deploy
      </button>
    </div>
  );
}
