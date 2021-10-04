import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MWorker } from '../api/API';

export default function OperatorScreen() {
  const { id } = useParams();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cellNbr, setCellNbr] = useState('');
  const [dateJoined, setDateJoined] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    MWorker.getById(id)
      .then((worker) => {
        // todo: check if currently logged in user => can edit their own info.
        setFirstName(worker.getFirstName());
        setLastName(worker.getLastName());
        setPhotoURL(worker.getImgURL());
        setStatus(worker.getStatus());
        setCellNbr(worker.getCellNbr());
        setDateJoined(worker.createdAt.toLocaleDateString('en-GB'));
        return worker.getRole();
      })
      .then((role) => {
        if (role === 'base_worker') setPosition('Base Worker');
        else setPosition('Field Worker');
      });
  }, []);

  return (
    <div>
      <div>
        <img src={photoURL} alt="operator-pic" />
        <table>
          <tr>
            <th>First Name</th>
            <td>{firstName}</td>
            <th>Date Joined</th>
            <td>{dateJoined}</td>
          </tr>
          <tr>
            <th>Last Name</th>
            <td>{lastName}</td>
            <th>Position</th>
            <td>{position}</td>
          </tr>
          <tr>
            <th>Cellphone</th>
            <td>{cellNbr}</td>
            <th>Activity Status</th>
            <td>{status}</td>
          </tr>
        </table>
      </div>
      <div>
        <h1>History</h1>
      </div>
    </div>
  );
}
