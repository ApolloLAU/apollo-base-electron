import React from 'react';
import { useHistory } from 'react-router-dom';
import './css/OperatorCard.scss';

import placeholder from '../../../../assets/empty-profile-picture.png';

export default function OperatorCard({ name, imgUrl, status, objectId }) {
  const history = useHistory();

  const circlePreview = () => {
    if (status === 'online') return { backgroundColor: '#00FF11FF' };
    if (status === 'away') return { backgroundColor: '#FFA200FF' };
    if (status === 'on_mission') return { backgroundColor: '#FF0000FF' };
    return { backgroundColor: '#000000FF' };
  };

  const onClick = () => {
    history.push(`/main/team/${objectId}`);
  };

  let finalImg = imgUrl !== '' ? imgUrl : placeholder;

  return (
    <div
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex={0}
      className="card"
    >
      <div style={{ background: `url(${finalImg})` }} className="rect" />
      <h1 className="name">{name}</h1>
      <img src={finalImg} alt="operator-profile-pic" className="image" />
      <span className="circle" style={circlePreview()} />
    </div>
  );
}
