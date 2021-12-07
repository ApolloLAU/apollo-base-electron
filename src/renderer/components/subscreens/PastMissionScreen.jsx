import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ChatMessage, Mission } from 'renderer/api/API';
import ChatLog from '../subcomponents/ChatLog';

import './css/PastMission.css';
import { SensorData } from '../../api/API';
import styles from '../navscreens/css/CurrentMissionScreen.module.css';
import placeholder from '../../../../assets/empty-profile-picture.png';
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryZoomContainer,
} from 'victory';

export default function PastMissionScreen() {
  const { id } = useParams();
  const [mission, setMission] = useState(undefined);
  const [patients, setPatients] = useState([]);
  const [baseWorkers, setBaseWorkers] = useState([]);
  const [fieldWorkers, setFieldWorkers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [dataPoints, setDataPoints] = useState([]); // TODO: THESE NEED TO BE GRAPHED

  // notes on the data points. The data points are all the data points related to the mission (can be ecg or spo2)
  // use .getDataType() to get the string rep of the type ex. 'ecg'
  // use .getValue() to get the value of the point (ie the Y-value to graph) as a string
  // if the data type has multiple data types (spo2 has IR and LED) these should be concated in the singl value,
  // so we need to decide how to format them across the diff devices.

  // we have no indication on the sample rate, so we don't have a scale for the X-axis. do we hardcode it?

  useEffect(() => {
    Mission.getByID(id).then(async (m) => {
      setPatients(m.getPatients());
      setBaseWorkers(m.getBaseWorkers());
      setFieldWorkers(m.getFieldWorkers());
      setDataPoints(
        await SensorData.getQueryForCurrentMission(
          m,
          m.getPatients()[0]
        ).first()
      );
      setMessages(await ChatMessage.getMessagesForMissionId(id));
      setMission(m);
    });
  }, []);

  const getName = (obj) => {
    return `${obj.getFormattedName()}`;
  };
  // we may have multiple patients, so print each.
  return mission ? (
    <div>
      <div>
        <h1>Mission {id}</h1>
        <div className={styles.missionArea}>
          <div>
            <div className={styles.upperArea}>
              <div className={styles.innerAreaRow}>
                <div className={styles.innerArea}>
                  <label className={styles.label}>Patients</label>
                  <p className={styles.details}>
                    {patients.map((pa, index) => (
                      <p className={styles.details} key={pa.id}>
                        {pa.getFormattedName()}
                      </p>
                    ))}
                  </p>
                </div>
                <div className={styles.innerArea}>
                  <label className={styles.label}>Location</label>
                  <p className={styles.details}>
                    {mission.getFormattedLocation()}
                  </p>
                </div>
                <div className={styles.innerArea}>
                  <div>
                    <label className={styles.label}>Mission Status</label>
                    <p className={styles.details}>ONGOING</p>
                  </div>
                </div>
                <div className={styles.innerArea}>
                  <label className={styles.label}>Team on Mission</label>
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
              </div>
            </div>
          </div>

          <p>BPM: {dataPoints ? dataPoints.getCurrentBPM() : ''}</p>
          <p>
            BPM Prediction:{' '}
            {dataPoints && dataPoints.get('predicted_diseases').length > 0
              ? dataPoints.get('predicted_diseases')[0]
              : ''}
          </p>
          <p>
            Disease Prediction:{' '}
            {dataPoints && dataPoints.get('predicted_diseases').length > 0
              ? dataPoints.get('predicted_diseases')[1]
              : ''}
          </p>
          <div className={styles.graphArea}>
            <VictoryChart
              domainPadding={{ x: 25 }}
              padding={{ top: 50, bottom: 50, right: 0, left: 50 }}
              height={250}
              theme={VictoryTheme.material}
              containerComponent={
                <VictoryZoomContainer
                  className={styles.graphStyle}
                  minimumZoom={{ x: 0.01, y: 1 }}
                />
              }
            >
              <VictoryLine
                style={{ data: { stroke: '#c43a31' } }}
                data={dataPoints ? dataPoints.getCleanECGVals() : []}
              />
            </VictoryChart>
          </div>
        </div>
        <div className={styles.sideBar}>
          <ChatLog messages={messages} isActive={false} />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
