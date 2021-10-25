import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useHistory } from 'react-router';
import { District, MWorker, API } from 'renderer/api/API';
import { Parse } from 'parse';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import styles from './css/AdminScreen.module.css';

const center = {
  lat: 34.12354711152072,
  lng: 35.65370044083664,
};

function DraggableMarker({ position, setPosition }) {
  const [draggable, setDraggable] = useState(false);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );

  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup minWidth={90}>
        <span
          role="button"
          onClick={toggleDraggable}
          onKeyDown={toggleDraggable}
          tabIndex={0}
        >
          {draggable
            ? 'Marker is draggable'
            : 'Click here to make marker draggable'}
        </span>
      </Popup>
    </Marker>
  );
}

export default function AdminScreen() {
  const history = useHistory();
  const [location, setDistrictLocation] = useState(center); // todo: need a map or smth to select
  const [formState, setFormState] = useState({
    imgData: '',
    imgType: '',
    districtName: 'Byblos',
    chiefFname: 'Peter',
    chiefLname: 'Sakr',
    chiefEmail: 'p.s@gmail.com',
    chiefPass: 'test123',
    chiefCell: '123456',
  });

  useEffect(() => {
    // make sure we are logged out!
    API.logOut();
  }, []);

  const handleChange = (evt) => {
    const { value } = evt.target;
    setFormState({ ...formState, [evt.target.name]: value });
  };

  const handleRegister = (event) => {
    event.preventDefault();
    // todo: form validation
    console.log('saving district');
    District.createDistrict(formState.districtName, location)
      .then((district) => {
        console.log('DISTRICT SAVED!');
        const userName = `${
          formState.chiefFname.toLowerCase().replace(/\s+/g, '') +
          formState.chiefLname.toLowerCase().replace(/\s+/g, '')
        }.chief`;

        return Promise.all([
          district,
          Parse.User.signUp(userName, formState.chiefPass),
        ]);
      })
      .then(([district, user]) => {
        const w = new MWorker();
        w.setFirstName(formState.chiefFname);
        w.setLastName(formState.chiefLname);
        w.setCellNbr(formState.chiefCell);
        w.setUserID(user.id);
        w.setDistrict(district);
        w.setRole('district_chief');
        w.setStatus('online');
        if (formState.imgData !== '')
          return w
            .setImg(
              formState.imgData,
              `profile.${formState.imgType.replace('image/', '')}`
            )
            .then(() => w.save());
        return w.save();
      })
      .then((_) => {
        console.log('COMPLETE');
        history.push('/main/history');
      });
  };

  const onImageClick = (event) => {
    event.preventDefault();
    window.electron.ipcRenderer.invoke('chooseImage').then((resObj) => {
      console.log(resObj);
      if (resObj.imgData !== '') {
        setFormState({
          ...formState,
          imgData: resObj.imgData,
          imgType: resObj.type,
        });
      }
    });
  };

  // window.electron.ipcRenderer.on('chosenFile', (event, arg, arg2) => {
  //   console.log('RECEIVED FILE', arg, arg2);
  //   const [base64, type] = arg;
  //   console.log(base64, type);
  //   if (base64 !== '') {
  //     setFormState({ ...formState, imgData: base64, imgType: type});
  //   }
  // });

  return (
    <div>
      <h1>Create District</h1>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        className={styles.adminmap}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker
          position={location}
          setPosition={setDistrictLocation}
        />
      </MapContainer>
      <form>
        <img
          src={
            formState.imgData !== ''
              ? `data:${formState.imgType};base64,${formState.imgData}`
              : ''
          }
          alt="profile"
        />
        <button type="submit" onClick={onImageClick}>
          Choose Image
        </button>
        <label>
          District Name
          <input
            type="text"
            value={formState.districtName}
            name="districtName"
            onChange={handleChange}
          />
        </label>
        <label>
          C. First Name:
          <input
            type="text"
            value={formState.chiefFname}
            name="chiefFname"
            onChange={handleChange}
          />
        </label>
        <label>
          C. Last Name:
          <input
            type="text"
            value={formState.chiefLname}
            name="chiefLname"
            onChange={handleChange}
          />
        </label>
        <label>
          C. Email
          <input
            type="text"
            value={formState.chiefEmail}
            name="chiefEmail"
            onChange={handleChange}
          />
        </label>
        <label>
          C. Password:
          <input
            type="password"
            value={formState.chiefPass}
            name="chiefPass"
            onChange={handleChange}
          />
        </label>
        <label>
          C. Cell Nbr:
          <input
            type="text"
            value={formState.chiefCell}
            name="chiefCell"
            onChange={handleChange}
          />
        </label>
        <button type="submit" onClick={handleRegister}>
          Register District
        </button>
      </form>
    </div>
  );
}
