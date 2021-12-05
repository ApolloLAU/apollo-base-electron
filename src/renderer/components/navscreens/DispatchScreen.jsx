import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import Modal from 'react-modal';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { Parse } from 'parse';
import L from 'leaflet';
import { useHistory } from 'react-router';
import styles from './css/DispatchScreen.module.css';
import { API, Mission, Patient } from '../../api/API';
import MissionCard from '../subcomponents/MissionCard';

import redMarker from '../../../../assets/marker.png';

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
  const history = useHistory();
  const [districtLoc, setDistrictLoc] = useState(undefined);
  const [deployableMissions, setDeployableMissions] = useState([]);
  const [missionCreateOptions, setMissionCreateOptions] = useState({
    open: false,
    latLng: {},
    formattedLocation: '',
    selectedPatients: undefined,
  });
  const unknownPatientName = 'UNKNOWN'; // FIXME: do we want something else?
  const getMissionLoc = (m) => m.get('location');
  const RedMarker = new L.Icon({
    iconUrl: redMarker,
    iconRetinaUrl: redMarker,
    iconAnchor: [12, 32],
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(24, 32),
  });

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
      selectedPatients: undefined,
    });
  };

  const getLocText = () => {
    return missionCreateOptions.formattedLocation !== ''
      ? missionCreateOptions.formattedLocation
      : `${missionCreateOptions.latLng.lat}, ${missionCreateOptions.latLng.lng}`;
  };

  // this is not tested!!!
  const getCardForMission = (mission) => {
    console.log(mission);
    return (
      <MissionCard
        key={mission.id}
        missionID={mission.id}
        missionDate={mission.createdAt}
        missionLocation={mission.getFormattedLocation()}
        patientName={mission.formatPatientNames()}
        onClck={() => history.push(`/main/deploy/${mission.id}`)}
      />
    );
  };

  const getPatientList = () =>
    Patient.getAllPatients()
      .then((patients) => {
        return patients.map((p) => {
          return { value: p.id, label: p.getFormattedName() };
        });
      })
      .then((labels) => [
        ...labels,
        { value: `${Math.random()}`, label: unknownPatientName },
      ]);
  // Promise.resolve([{ value: Math.random(), label: unknownPatientName }]); // TODO: promise that returns possible patients to add to mission.
  // const filterPatientList = (searchTerm) => []; // TODO: returns list of filtered patients for searching.
  const filterPatientList = async (searchTerm) => {
    return getPatientList()
      .then((list) => {
        const out = list.filter(
          (o) =>
            o.label === unknownPatientName ||
            o.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.value.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log(out);
        return out;
      })
      .catch((err) => console.log(err));
  };

  const onSelectPatient = (option) => {
    let newOption;
    if (option === null) {
      setMissionCreateOptions({
        ...missionCreateOptions,
        selectedPatients: undefined,
      });
      return;
    }
    if (option.label === unknownPatientName) {
      newOption = { label: unknownPatientName, value: Math.random() };
    } else {
      newOption = option;
    }

    setMissionCreateOptions({
      ...missionCreateOptions,
      selectedPatients: newOption,
    });
  };

  const initializeMissionList = () => {
    const user = API.getLoggedInUser();
    API.getWorkerForUser(user)
      .then((worker) => {
        return worker.getDistrict().fetch();
      })
      .then((district) => {
        console.log(district.getLoc());
        setDistrictLoc(district.getLoc());
      });
    Mission.getDeployableMissions()
      .then((missions) => {
        console.log('got missions', missions);
        return missions.map((m) =>
          Mission.fromJSON({ ...m, className: 'Mission' })
        );
      })
      .then(async (parseMissions) => {
        console.log('parseMissions', parseMissions);
        await Promise.all(parseMissions.map((p) => p.fetch()));

        // for each mission, actually fetch the patients. la2anno they aren't being fetched.
        // then can use the correct ones.
        setDeployableMissions(parseMissions);
      });
  };

  useEffect(() => {
    initializeMissionList();
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

    const p = missionCreateOptions.selectedPatients;
    if (p.__isNew__) {
      // the patient needs to be created.
      console.log('creating new patient');
      const pName = p.label.split(' '); // name of patient to be created.
      const patient = Patient.createEmptyPatient();
      patient.setFirstName(pName[0]);
      if (pName.length > 1) patient.setLastName(pName.slice(1).join(' '));
      m.addPatient(patient);
    } else if (p.label === unknownPatientName) {
      // the patient is unknown ==> link to john doe profile.
      const patient = Patient.createEmptyPatient();
      patient.setFirstName('Unknown');
      patient.setLastName('Patient');
      m.addPatient(patient);
    } else {
      // the patient already exists. link to patientId.
      const patient = new Patient();
      const patientId = p.value;
      patient.id = patientId;
      m.addPatient(patient);
    }

    console.log('saving mission', m);
    m.save().then(() => {
      setMissionCreateOptions({
        ...missionCreateOptions,
        open: false,
        formattedLocation: '',
        selectedPatients: undefined,
      });
      initializeMissionList();
    });
  };

  const getMarkerForMission = (m) => {
    const loc = getMissionLoc(m);
    return (
      // eslint-disable-next-line no-underscore-dangle
      <Marker position={[loc._latitude, loc._longitude]} icon={RedMarker} />
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
          className={styles.myModal}
        >
          <h1>Deploy New Mission</h1>
          <p>Location:&emsp;{getLocText()}</p>
          <p>Select Patients:</p>
          <AsyncCreatableSelect
            cacheOptions
            backspaceRemovesValue
            isClearable
            loadOptions={filterPatientList}
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
            {deployableMissions.map((m) => getMarkerForMission(m))}
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
