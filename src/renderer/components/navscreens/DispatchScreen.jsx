import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import Modal from 'react-modal';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { Parse } from 'parse';
import styles from './css/DispatchScreen.module.css';
import { API, Mission, Patient } from '../../api/API';
import MissionCard from '../subcomponents/MissionCard';

const opencage = require('opencage-api-client');

function MapInteractionComponent({ onClick }) {
  const map = useMapEvents({
    contextmenu: (evt) => {
      console.log(evt); // right clicked on map.
      onClick(evt.latlng);
    },
  });
  return null;
}

export default function DispatchScreen() {
  const [districtLoc, setDistrictLoc] = useState(undefined);
  const [deployableMissions, setDeployableMissions] = useState([]);
  const [missionCreateOptions, setMissionCreateOptions] = useState({
    open: false,
    latLng: {},
    formattedLocation: '',
    selectedPatients: [],
  });
  const unknownPatientName = 'UNKNOWN'; // FIXME: do we want something else?

  const onMapRClick = (latLng) => {
    console.log('Right clicked here:', latLng);
    opencage
      .geocode({
        q: `${latLng.lat},${latLng.lng}`,
        key: 'ea82eabc49b1406cb4ad061e35914120',
      })
      .then((data) => {
        console.log(data);
        setMissionCreateOptions({
          ...missionCreateOptions,
          open: true,
          latLng,
          formattedLocation: data.results[0].formatted,
        });
      })
      .catch((error) => {
        console.log('error geocoding', error);
        setMissionCreateOptions({
          ...missionCreateOptions,
          open: true,
          latLng,
        });
      });
  };

  const onCloseMissionCreation = () => {
    setMissionCreateOptions({
      ...missionCreateOptions,
      open: false,
      formattedLocation: '',
      selectedPatients: [],
    });
  };

  const getLocText = () => {
    return missionCreateOptions.formattedLocation !== ''
      ? missionCreateOptions.formattedLocation
      : `${missionCreateOptions.latLng.lat}, ${missionCreateOptions.latLng.lng}`;
  };

  // this is not tested!!!
  const getCardForMission = (mission) => (
    <MissionCard
      key={mission.id}
      missionID={mission.id}
      missionDate={mission.createdAt}
      missionLocation={mission.getFormattedLocation()}
      patientName={mission.formatPatientNames()}
    />
  );

  const getPatientList = () =>
    Patient.getAllPatients()
      .then((patients) => {
        return patients.map((p) => {
          return { value: p.id, label: p.getFormattedName() };
        });
      })
      .then((labels) => [
        ...labels,
        { value: Math.random(), label: unknownPatientName },
      ]);
  // Promise.resolve([{ value: Math.random(), label: unknownPatientName }]); // TODO: promise that returns possible patients to add to mission.
  // const filterPatientList = (searchTerm) => []; // TODO: returns list of filtered patients for searching.

  const onSelectPatient = (option) => {
    const newOptions = option.map((o) => {
      if (o.label === unknownPatientName) {
        return { label: unknownPatientName, value: Math.random() };
      }
      return o;
    });
    setMissionCreateOptions({
      ...missionCreateOptions,
      selectedPatients: newOptions,
    });
  };

  useEffect(() => {
    const user = API.getLoggedInUser();
    API.getWorkerForUser(user)
      .then((worker) => {
        return worker.getDistrict().fetch();
      })
      .then((district) => {
        console.log(district.getLoc());
        setDistrictLoc(district.getLoc());
      });
    Mission.getDeployableMissions().then((missions) => {
      console.log('got missions', missions);
      const missionObjs = missions.map((m) =>
        Mission.fromJSON({ ...m, className: 'Mission' })
      );
      setDeployableMissions(missionObjs);
    });
  }, []);

  const createMission = (e) => {
    e.preventDefault();
    const m = Mission.createDeployableMission();
    m.setLocation(
      new Parse.GeoPoint({
        latitude: missionCreateOptions.latLng.lat,
        longitude: missionCreateOptions.latLng.lng,
      })
    );
    m.setFormattedLocation(missionCreateOptions.formattedLocation);

    // TODO: create OR link the patients
    let unknownIndex = 0;
    missionCreateOptions.selectedPatients.forEach((p) => {
      if (p.__isNew__) {
        // the patient needs to be created.
        console.log('creating new patient');
        const pName = p.label; // name of patient to be created.
        const patient = Patient.createEmptyPatient();
        // FIXME: set patient name (should we just split on last space?).
        m.addPatient(patient);
      } else if (p.label === unknownPatientName) {
        // the patient is unknown ==> link to john doe profile.
        const patient = new Patient();
        patient.id = `${unknownPatientName}${unknownIndex}`;
        m.addPatient(patient);
        unknownIndex++;
      } else {
        // the patient already exists. link to patientId.
        const patient = new Patient();
        const patientId = p.value;
        patient.id = patientId;
        m.addPatient(patient);
      }
    });

    console.log('saving mission', m);
    m.save().then(() =>
      setMissionCreateOptions({
        ...missionCreateOptions,
        open: false,
        formattedLocation: '',
        selectedPatients: [],
      })
    );
  };

  if (districtLoc) {
    return (
      <div>
        <Modal
          isOpen={missionCreateOptions.open}
          onRequestClose={onCloseMissionCreation}
          ariaHideApp={false}
          closeTimeoutMS={100}
        >
          <h1>Deploy New Mission</h1>
          <p>Location:&emsp;{getLocText()}</p>
          <p>Select Patients:</p>
          <AsyncCreatableSelect
            isMulti
            cacheOptions
            backspaceRemovesValue
            isClearable
            loadOptions={getPatientList}
            onChange={onSelectPatient}
            value={missionCreateOptions.selectedPatients}
          />
          <button type="button" onClick={createMission}>
            Create Mission
          </button>
        </Modal>
        <div className={styles.dispatchlayout}>
          <MapContainer
            center={[districtLoc.latitude, districtLoc.longitude]}
            zoom={15}
            scrollWheelZoom
            className={styles.map}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapInteractionComponent onClick={onMapRClick} />
          </MapContainer>
          <div>
            <h2>Missions</h2>
            <div>{deployableMissions.map((m) => getCardForMission(m))}</div>
          </div>
        </div>
      </div>
    );
  }
  return <div />;
}
