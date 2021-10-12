import React, { useEffect, useState } from 'react';
import { MWorker, API } from '../api/API';
import OperatorCard from './OperatorCard';

export default function TeamScreen() {
  const [baseWorkers, setBaseWorkers] = useState([]);
  const [fieldWorkers, setFieldWorkers] = useState([]);
  const [chiefs, setChiefs] = useState([]);

  useEffect(() => {
    // todo: work on getting live status updates
    API.getWorkerForUser(API.getLoggedInUser()).then((mWorker) => {
      const district = mWorker.getDistrict();
      MWorker.getDistrictChiefs(district).then((cWorkers) => {
        setChiefs(cWorkers);
      });
      MWorker.getBaseWorkers(district).then((bWorkers) => {
        console.log('base workers:');
        setBaseWorkers(bWorkers);
      });
      MWorker.getFieldWorkers(district).then((fWorkers) => {
        console.log('field workers:');
        setFieldWorkers(fWorkers);
      });
    });

    // if the component unmounts, unsubscribe from livequery
    // return () => {
    //   API.unsubscribeSession();
    // };
  }, []);

  return (
    <div>
      <div>
        <h2>District Chiefs</h2>
        {chiefs.map((worker) => (
          <OperatorCard
            name={`${worker.getFirstName()} ${worker.getLastName()}`}
            imgUrl={worker.getImgURL()}
            status={worker.getStatus()}
            objectId={worker.id}
            key={worker.id}
          />
        ))}
        <h2>Base Workers</h2>
        {baseWorkers.map((worker) => (
          <OperatorCard
            name={`${worker.getFirstName()} ${worker.getLastName()}`}
            imgUrl={worker.getImgURL()}
            status={worker.getStatus()}
            objectId={worker.id}
            key={worker.id}
          />
        ))}
      </div>
      <div>
        <h2>Field Workers</h2>
        {fieldWorkers.map((worker) => (
          <OperatorCard
            name={`${worker.getFirstName()} ${worker.getLastName()}`}
            imgUrl={worker.getImgURL()}
            status={worker.getStatus()}
            objectId={worker.id}
            key={worker.id}
          />
        ))}
      </div>
    </div>
  );
}
