import Modal from 'react-modal';

export default function PatientModal({ patient, isModalOpen, onRequestClose }) {
  return (
    <Modal isOpen={isModalOpen} onRequestClose={onRequestClose}>
      <h1>{patient.getFormattedName()}</h1>
      <div>
        <div>
          <p>Sex</p>
          <p>{patient.getSex()}</p>
        </div>
        <div>
          <p>Date of Birth</p>
          <p>{patient.getDOB() ? patient.getDOB().toLocaleDateString() : "UNKNOWN"}</p>
        </div>
        <div>
          <p>Address</p>
          <p>{patient.getHomeAddress()}</p>
        </div>
        <div>
          <p>Emergency Contact</p>
          <p>{patient.getEmergencyNbr()}</p>
        </div>
        <div>
          <p>Blood Type</p>
          <p>{patient.getBloodType()}</p>
        </div>
        <div>
          <p>Height</p>
          <p>{patient.getHeight()}</p>
        </div>
        <div>
          <p>Weight</p>
          <p>{patient.getWeight()}</p>
        </div>
        <div>
          <p>Allergies</p>
          <p>{patient.getAllergies()}</p>
        </div>
        <div>
          <p>Previous Heart Conditions</p>
          <input
            type="checkbox"
            disabled
            checked={patient.getPrevConditions()}
          />
        </div>
      </div>
    </Modal>
  );
}
