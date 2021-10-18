import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import './css/DispatchScreen.css';
import Modal from 'react-modal';
import Select from 'react-select';
import { API, Mission } from '../../api/API';

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
  });

  const onMapRClick = (latLng) => {
    console.log('Right clicked here:', latLng);
    // opencage
    //   .geocode({
    //     q: `${latLng.lat},${latLng.lng}`,
    //     key: 'ea82eabc49b1406cb4ad061e35914120',
    //   })
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((error) => {
    //     console.log('error geocoding', error);
    //   });
    setMissionCreateOptions({ ...missionCreateOptions, open: true, latLng });
  };

  const onCloseMissionCreation = () => {
    setMissionCreateOptions({ ...missionCreateOptions, open: false });
  };

  useEffect(() => {
    const user = API.getLoggedInUser();
    API.getWorkerForUser(user)
      .then((worker) => {
        console.log('District:', worker.getDistrict());
        return worker.getDistrict().fetch();
      })
      .then((district) => {
        console.log(district.getLoc());
        setDistrictLoc(district.getLoc());
      });
    Mission.getActiveMissions().then((missions) => {
      setDeployableMissions(missions);
    });
  }, []);

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
          <p>
            Location:&emsp;{missionCreateOptions.latLng.lat},{' '}
            {missionCreateOptions.latLng.lng}
          </p>
          <div>
            <p>Add Patient:</p>
            <Select />
            <button type="button">Add John Doe</button>
          </div>
        </Modal>
        <div className="dispatch-layout">
          <MapContainer
            center={[districtLoc.latitude, districtLoc.longitude]}
            zoom={15}
            scrollWheelZoom
            className="map"
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapInteractionComponent onClick={onMapRClick} />
          </MapContainer>
          <div>
            <h2>Missions</h2>
          </div>
        </div>
      </div>
    );
  }
  return <div />;
}
