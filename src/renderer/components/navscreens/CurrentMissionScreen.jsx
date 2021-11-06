import { useState, useEffect } from 'react';
import { API, Mission } from 'renderer/api/API';
import ChatLog from "../subcomponents/ChatLog";

import placeholder from '../../../../assets/empty-profile-picture.png';
import styles from './css/CurrentMissionScreen.module.css';
import {ChatMessage} from "../../api/API";

export default function CurrentMissionScreen() {
  const [currentMission, setCurrentMission] = useState(null);
  const [currentWorker, setCurrentWorker] = useState(undefined);
  const [currentPatients, setCurrentPatients] = useState([]);
  const [baseWorkers, setBaseWorkers] = useState([]);
  const [fieldWorkers, setFieldWorkers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageSubscription, setMessageSubscription] = useState(undefined);

  const [chatValue, setChatValue] = useState('')

  useEffect(() => {

    API.getWorkerForUser(API.getLoggedInUser())
      .then((cWorker) => {
        setCurrentWorker(cWorker);
        return Mission.getWorkerActiveMission(cWorker);
      })
      .then((cMission) => cMission.fetch()).then(async (cMission) => {
        console.log("Patients", cMission.getPatients());
        await Promise.all(cMission.getFieldWorkers().map((w) => w.fetch()))
        await Promise.all(cMission.getBaseWorkers().map((w) => w.fetch()))
        await Promise.all(cMission.getPatients().map((w) => w.fetch()))
        setCurrentMission(cMission);
        setCurrentPatients(cMission.getPatients());
        setBaseWorkers(cMission.getBaseWorkers());
        setFieldWorkers(cMission.getFieldWorkers());
        setMessages(await ChatMessage.getMessagesForMissionId(cMission.id));
        if (!messageSubscription) {
          const q = ChatMessage.getMessageForMissionQuery(cMission.id);
          setMessageSubscription(await q.subscribe());
        }
      });
  }, []);

  useEffect(() => {
    if (messageSubscription) {
      messageSubscription.on('create', (msg) => {
        console.log("GOT A NEW MESSAGE")
        setMessages([...messages, msg]);
      });
    }

    return () => {
      if (messageSubscription) messageSubscription.unsubscribe();
    }
  }, [messageSubscription]);

  const onSendChat = (e) => {
    e.preventDefault();

    if (currentWorker) {
      let msg = new ChatMessage();
      msg.setMessage(chatValue);
      msg.setSender(currentWorker);
      msg.setMission(currentMission.id);
      msg.save();
    }

  }

  return currentMission !== null ? (
    <div>
        <div>
          <h1>Mission {currentMission.id}</h1>
          <div className={styles.missionArea}>
          <div className={styles.upperArea}>
            <div className={styles.innerAreaRow}>
              <div className={styles.innerArea}>
              <label className={styles.label}>Patients</label>
              <p className={styles.details}>
                {currentPatients.map((pa) => (
                  <p className={styles.details} key={pa.id}>{pa.getFormattedName()}</p>
                ))}
              </p>
              </div>
              <div className={styles.innerArea}>
              <label  className={styles.label}>Location</label>
              <p className={styles.details}>{currentMission.getFormattedLocation()}</p>
              </div>
            </div>
            <div className={styles.innerArea}>
              <div>
                <label  className={styles.label}>Mission Status</label>
                <p className={styles.details}>ONGOING</p>
              </div>
              <button className={styles.updateButton}>Update Status</button>
            </div>
            <div className={styles.innerArea}>
              <label  className={styles.label}>Team on Mission</label>
              <div>
                {baseWorkers.map((w) => (
                  <img
                    className="profile-pic"
                    src={w.getImgURL() || placeholder}
                    key={w.id}
                    alt="base-worker"
                  />
                ))}
                {fieldWorkers.map((w) => (
                  <img
                    className="profile-pic"
                    src={w.getImgURL() || placeholder}
                    key={w.id}
                    alt="field-worker"
                  />
                ))}
              </div>
            </div>
            <div className={styles.innerArea}>
              <button className={styles.requestButton}>Request ECT</button>
              <button className={styles.requestButton}>Request BPM</button>
              <button className={styles.requestButton}>Request SpO2</button>
              <button className={styles.requestButton}>Request Image</button>
            </div>
          </div>
          <div className={styles.sideBar}>
            <ChatLog messages={messages} isActive={true} chatValue={chatValue} setChatValue={setChatValue} onSend={onSendChat}/>
          </div>
          </div>
        </div>
        <div>
          <h1>Bottom Content</h1>
        </div>
    </div>
  ) : (
    <div>
      <h1>No Active Mission</h1>
    </div>
  );
}
