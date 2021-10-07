import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { District, MWorker } from 'renderer/api/API';
import { Parse } from 'parse';

export default function AdminScreen() {
  const history = useHistory();
  const [location, setDistrictLocation] = useState({
    latitude: 0.0,
    longitude: 0.0,
  }); // todo: need a map or smth to select
  const [formState, setFormState] = useState({
    districtName: '',
    chiefFname: '',
    chiefLname: '',
    chiefEmail: '',
    chiefPass: '',
    chiefCell: '',
  });

  const handleChange = (evt) => {
    const { value } = evt.target;
    setFormState({ ...formState, [evt.target.name]: value });
  };

  const handleRegister = () => {
    // todo: form validation
    District.createDistrict(formState.districtName, location).then(
      async (district) => {
        const userName = `${
          formState.chiefFname.toLowerCase().replace(/\s+/g, '') +
          formState.chiefFname.toLowerCase().replace(/\s+/g, '')
        }.chief`;

        const user = await Parse.User.signUp(userName, formState.chiefPass);
        const role = new Parse.Query(Parse.Role)
          .equalTo('name', 'district_chief')
          .first();
        role.getUsers().add(user);
        await role.save();
        const w = new MWorker();
        w.setFirstName(formState.chiefFname);
        w.setLastName(formState.chiefLname);
        w.setCellNbr(formState.chiefCell);
        w.setUserID(user.id);
        w.setDistrict(district);
        // w.setImg() TODO
        await w.save();
        history.push('/main/history');
      }
    );
  };

  return (
    <div>
      <h1>Create District</h1>
      <form>
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
