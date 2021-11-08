import React, { useState, useEffect } from 'react';
import { API, Mission } from 'renderer/api/API';
import ChatLog from "../subcomponents/ChatLog";

import Modal from 'react-modal';
import placeholder from '../../../../assets/empty-profile-picture.png';
import styles from './css/CurrentMissionScreen.module.css';
import {ChatMessage} from "../../api/API";
import {useHistory} from "react-router-dom";


export default function CurrentMissionScreen() {
  let history = useHistory();
  const [forceUpdate, setForceUpdate] = useState(0);

  const [currentMission, setCurrentMission] = useState(null);
  const [currentWorker, setCurrentWorker] = useState(undefined);
  const [currentPatients, setCurrentPatients] = useState([]);
  const [baseWorkers, setBaseWorkers] = useState([]);
  const [fieldWorkers, setFieldWorkers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageSubscription, setMessageSubscription] = useState(undefined);

  const [chatValue, setChatValue] = useState('');

  const [isModalOpen, setModalOpen] = useState(false);
  const [newMissionStatus, setNewMissionStatus] = useState('complete');
  const [handOffWorker, setHandOffWorker] = useState('');
  const [finalReport, setFinalReport] = useState('');

  useEffect(() => {

    API.getWorkerForUser(API.getLoggedInUser())
      .then((cWorker) => {
        if (cWorker !== undefined) {
          setCurrentWorker(cWorker);
          return Mission.getWorkerActiveMission(cWorker);
        }
        throw new Error("Not Logged In");
      }).then((cMission) => {
        if (cMission === null) {
          throw new Error("MissionNullError");
        }
        return cMission;
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
      })
      .catch((err) => {
        if (err.message !== 'MissionNullError') {
          console.log("ERROR:", err);
        } else {
          console.log("No active mission found");
        }
      });
  }, [forceUpdate]);

  useEffect(() => {
    if (messageSubscription) {
      messageSubscription.on('create', (msg) => {
        console.log("GOT A NEW MESSAGE")
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      if (messageSubscription) messageSubscription.unsubscribe();
    }
  }, [messageSubscription]);

  const sendMessage = (txt) => {
    if (currentWorker) {
      let msg = new ChatMessage();
      msg.setMessage(txt);
      msg.setSender(currentWorker);
      msg.setMission(currentMission.id);
      msg.save();
    }
  }

  const onSendChat = (e) => {
    e.preventDefault();
    sendMessage(chatValue);
  }

  const onSendECG = (e) => {
    e.preventDefault();
    sendMessage('ECG Reading Requested');
  };

  const onSendSpo2 = (e) => {
    e.preventDefault();
    sendMessage('SpO2 Reading Requested');
  };

  const onSendBPM = (e) => {
    e.preventDefault();
    sendMessage('BPM Reading Requested');
  };

  const onSendImage = (e) => {
    e.preventDefault();
    sendMessage('Image Requested');
  };

  const onCloseModal = () => {
    setModalOpen(false);
  };

  const onClickUpdate = (e) => {
    e.preventDefault();
    setModalOpen(true);
  }

  const onChangeMissionUpdate = (e) => {
    setNewMissionStatus(e.target.value);
  }

  const onChangeMissionReport = (e) => {
    setFinalReport(e.target.value);
  }

  const onCompleteMission = (e) => {
    e.preventDefault();
    if (newMissionStatus === 'complete') {
      currentMission.setFinalDesc(finalReport);
      currentMission.setStatus("complete");
      // ba3d fi shi?
      currentMission.save().then(() => history.push('/main/history'));
    } else {
      // todo: set another worker active.
    }
  }

  return currentMission !== null ? (
    <div className={styles.mainArea} >
      <Modal
        isOpen={isModalOpen}
        onRequestClose={onCloseModal}
        ariaHideApp={false}
        closeTimeoutMS={100} >
        <h1>Update Mission Status</h1>
        <p>New Status:</p>
        <select name="updated_status" onChange={onChangeMissionUpdate} value={newMissionStatus}>
          <option value="complete">Complete</option>
          <option value="hand-off">Hand Off to another Base Worker</option>
        </select>
        {newMissionStatus === "hand-off" ? <select><option>Another Worker</option></select> : <></>}
        <p>Final Report:</p>
        <textarea value={finalReport} onChange={onChangeMissionReport} disabled={newMissionStatus === 'hand-off'} />
        <button onClick={onCompleteMission}>{newMissionStatus === 'complete' ? "Complete Mission": "Hand Off Mission"}</button>
      </Modal>
      <h1>Mission {currentMission.id}</h1>
      <div className={styles.missionArea}>
        <div>
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
              <button className={styles.updateButton} type='button' onClick={onClickUpdate}>Update Status</button>
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
              <button className={styles.requestButton} type='button' onClick={onSendECG}>Request ECG</button>
              <button className={styles.requestButton} type='button' onClick={onSendBPM}>Request BPM</button>
              <button className={styles.requestButton} type='button' onClick={onSendSpo2}>Request SpO2</button>
              <button className={styles.requestButton} type='button' onClick={onSendImage}>Request Image</button>
            </div>
          </div>
          <h1>Bottom Content</h1>
        </div>
        <div className={styles.sideBar}>
          <ChatLog messages={messages} isActive={true} chatValue={chatValue} setChatValue={setChatValue} onSend={onSendChat}/>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <h1>No Active Mission</h1>
    </div>
  );
}
