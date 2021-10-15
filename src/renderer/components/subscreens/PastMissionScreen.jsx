import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ChatMessage, MedicalDataPt, Mission } from 'renderer/api/API';
import ChatLog from '../subcomponents/ChatLog';

import '../css/PastMission.global.css';

export default function PastMissionScreen() {
  const { id } = useParams();
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
      setPatients(await m.getPatients());
      setBaseWorkers(await m.getBaseWorkers());
      setFieldWorkers(await m.getFieldWorkers());
      setDataPoints(await MedicalDataPt.getMedicalDataForMission(id));
      setMessages(await ChatMessage.getMessagesForMissionId(id));
    });
  }, []);

  const getName = (obj) => {
    return `${obj.get('firstname')} ${obj.get('lastname')}`;
  };
  // we may have multiple patients, so print each.
  return (
    <div>
      <div>
        <h1>Mission {id}</h1>
        <table>
          <tr>
            <th>Patients</th>
            <td>
              {patients.map((pa) => (
                <p key={pa.id}>{getName(pa)}</p>
              ))}
            </td>
          </tr>
          <tr>
            <th>Mission Status</th>
            <td>COMPLETED</td>
          </tr>
          <tr>
            <th>Base Workers</th>
            <td>
              {baseWorkers.map((w) => (
                <img
                  className="profile-pic"
                  src={w.getImgURL()}
                  key={w.id}
                  alt="base-worker"
                />
              ))}
            </td>
          </tr>
          <tr>
            <th>Field Workers</th>
            <td>
              {fieldWorkers.map((w) => (
                <img
                  className="profile-pic"
                  src={w.getImgURL()}
                  key={w.id}
                  alt="field-worker"
                />
              ))}
            </td>
          </tr>
        </table>
        <div>
          <h1>BOTTOM CONTENT!!!!</h1>
          <ChatLog messages={messages} isActive={false} />
        </div>
      </div>
      <div>
        <h1>SIDE CONTENT</h1>
      </div>
    </div>
  );
}
