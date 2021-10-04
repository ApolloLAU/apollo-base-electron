import React, { useEffect, useState } from 'react';
import { MWorker } from '../api/API';
import OperatorCard from './OperatorCard';

export default function TeamScreen() {
  const [baseWorkers, setBaseWorkers] = useState([]);
  const [fieldWorkers, setFieldWorkers] = useState([]);

  useEffect(() => {
    MWorker.getBaseWorkers().then((bWorkers) => {
      console.log('base workers:');
      setBaseWorkers(bWorkers);
    });
    MWorker.getFieldWorkers().then((fWorkers) => {
      console.log('field workers:');
      setFieldWorkers(fWorkers);
    });
  }, []);

  return (
    <div>
      <div>
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
