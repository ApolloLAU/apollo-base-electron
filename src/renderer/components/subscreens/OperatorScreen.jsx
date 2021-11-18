import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API, Mission, MWorker } from '../../api/API';
import MissionCard from '../subcomponents/MissionCard';
import EditableText from '../subcomponents/EditableText';

import styles from './css/OperatorScreen.module.css';

export default function OperatorScreen() {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cellNbr: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [missions, setMissions] = useState([]);
  const [editable, setEditable] = useState(false);
  const [editEnabled, setEditEnabled] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(undefined);

  useEffect(() => {
    MWorker.getById(id)
      .then(async (worker) => {
        // todo: check if currently logged in user => can edit their own info.
        const current = API.getLoggedInUser();
        if ((await API.getWorkerForUser(current)).id === worker.id) {
          console.log('Im the current worker!');
          setEditable(true); // user can edit
        }
        setFormData({
          ...formData,
          firstName: worker.getFirstName(),
          lastName: worker.getLastName(),
          cellNbr: worker.getCellNbr(),
        });
        setPhotoURL(worker.getImgURL());
        setStatus(worker.getStatus());
        setMissions(await Mission.getCompletedMissionsForWorker(worker));
        setCurrentWorker(worker);
        return worker.getRole();
      })
      .then((role) => {
        if (role === 'base_worker') setPosition('Base Worker');
        else setPosition('Field Worker');
      });
  }, []);

  const onClickEdit = (e) => {
    e.preventDefault();
    if (!editEnabled) {
      setEditEnabled(true);
    } else {
      setFormData({
        ...formData,
        firstName: currentWorker.getFirstName(),
        lastName: currentWorker.getLastName(),
        cellNbr: currentWorker.getCellNbr(),
        password: '',
        confirmPassword: '',
      });
      setEditEnabled(false);
    }
  };

  // when any of form values are changed
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSaveChanges = async (e) => {
    e.preventDefault();
    const { firstName, lastName, cellNbr, password, confirmPassword } =
      formData;
    if (firstName.length > 0 && lastName.length > 0) {
      if (password !== '' && confirmPassword === password) {
        // set user password and save it.
        const user = API.getLoggedInUser();
        if (user) {
          user.setPassword(password);
          await user.save();
        }
        currentWorker.setFirstName(firstName);
        currentWorker.setLastName(lastName);
        currentWorker.setCellNbr(cellNbr);
        await currentWorker.save();
        setEditEnabled(false);
      } else if (password !== '') {
        // show password error to user
      } else {
        // only save user data
        currentWorker.setFirstName(firstName);
        currentWorker.setLastName(lastName);
        currentWorker.setCellNbr(cellNbr);
        await currentWorker.save();
        setEditEnabled(false);
      }
    } else {
      // show error to user!
    }
  };

  return currentWorker !== undefined ? (
    <div>
      {editable && !editEnabled ? (
        <button onClick={onClickEdit} type="button">
          Edit
        </button>
      ) : (
        <></>
      )}
      {editEnabled ? (
        <div>
          <button type="button" onClick={onSaveChanges}>
            Save Changes
          </button>
          <button type="button" onClick={onClickEdit}>
            Cancel
          </button>
        </div>
      ) : (
        <></>
      )}
      <div className={styles.operatorInfo}>
        <div className={styles.operatorImage}>
          <img
            src={photoURL}
            alt="operator-pic"
            className={styles.profilePic}
          />
        </div>
        <div className={styles.operatorData}>
          <p>First Name</p>
          <EditableText
            value={formData.firstName}
            isEditMode={editEnabled}
            name="firstName"
            onChange={onChange}
          />
        </div>
        <div className={styles.operatorData}>
          <p>Last Name</p>
          <EditableText
            value={formData.lastName}
            isEditMode={editEnabled}
            name="lastName"
            onChange={onChange}
          />
        </div>
        <div className={styles.operatorData}>
          <p>Cellphone</p>
          <EditableText
            value={formData.cellNbr}
            isEditMode={editEnabled}
            name="cellNbr"
            onChange={onChange}
          />
        </div>
        <div className={styles.operatorData}>
          <p>Date Joined</p>
          <EditableText
            value={currentWorker.createdAt.toLocaleDateString('en-GB')}
            isEditMode={false}
          />
        </div>
        <div className={styles.operatorData}>
          <p>Position</p>
          <EditableText value={position} isEditMode={false} />
        </div>
        <div className={styles.operatorData}>
          <p>Status</p>
          <EditableText value={status.toUpperCase()} isEditMode={false} />
        </div>
        {editEnabled ? (
          <div>
            <div className={styles.operatorData}>
              <p>New Password</p>
              <EditableText
                value={formData.password}
                isPassword
                isEditMode
                name="password"
                onChange={onChange}
              />
            </div>
            <div className={styles.operatorData}>
              <p>Confirm New Password</p>
              <EditableText
                value={formData.confirmPassword}
                isPassword
                isEditMode
                name="confirmPassword"
                onChange={onChange}
              />
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div>
        <h1>History</h1>
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
