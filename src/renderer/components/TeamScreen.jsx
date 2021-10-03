import React, { useEffect, useState } from 'react';
import { FRSWorker } from '../api/API';
import OperatorCard from './OperatorCard';

export default function TeamScreen() {
  const [baseWorkers, setBaseWorkers] = useState([]);
  const [fieldWorkers, setFieldWorkers] = useState([]);

  useEffect(() => {
    FRSWorker.getBaseWorkers().then((bWorkers) => {
      console.log('base workers:');
      setBaseWorkers(bWorkers);
    });
    FRSWorker.getFieldWorkers().then((fWorkers) => {
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
