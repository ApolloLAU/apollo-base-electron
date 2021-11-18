import { useEffect, useState } from 'react';
import { Patient } from '../../api/API';
import CivilianCard from '../subcomponents/CivilianCard';

export default function RecordsScreen() {
  const [civilians, setCivilians] = useState([]);

  useEffect(() => {
    Patient.getAllPatients().then((patients) => setCivilians(patients));
  }, []);

  return (
    <div>
      {civilians.map((p) => (
        <CivilianCard
          patientName={p.getFormattedName()}
          patientId={p.id}
          address={p.getHomeAddress()}
          dob={p.getDOB()}
          sex={p.getSex()}
          key={p.id}
        />
      ))}
    </div>
  );
}
