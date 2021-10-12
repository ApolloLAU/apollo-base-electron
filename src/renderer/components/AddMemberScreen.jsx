import React, { useEffect, useState } from 'react';
import { Parse } from 'parse';
import { API, MWorker } from '../api/API';

export default function AddMemberScreen() {
  const [formData, setFormData] = useState({
    imgData: '',
    imgType: '',
    firstName: '',
    lastName: '',
    email: '',
    pass: '',
    confirmPass: '',
    cellNbr: '',
    role: 'base_worker',
  });

  useEffect(() => {
    // check current user role.
  }, []);

  const handleChange = (evt) => {
    const { value } = evt.target;
    setFormData({ ...formData, [evt.target.name]: value });
  };

  const getUsername = () => {
    let ending;
    if (formData.role === 'field_worker') {
      ending = 'field';
    } else if (formData.role === 'base_worker') {
      ending = 'base';
    } else {
      ending = 'chief';
    }
    return `${
      formData.firstName.toLowerCase().replace(/\s+/g, '') +
      formData.lastName.toLowerCase().replace(/\s+/g, '')
    }.${ending}`;
  };

  const onSave = (evt) => {
    evt.preventDefault();
    const chiefUser = API.getLoggedInUser();
    const sessionToken = chiefUser.getSessionToken();
    API.getWorkerForUser(chiefUser)
      .then((chief) => {
        const district = chief.getDistrict();
        return Promise.all([
          district,
          Parse.User.signUp(getUsername(), formData.pass),
        ]);
      })
      .then(([district, newUser]) => {
        const w = new MWorker();
        w.setFirstName(formData.firstName);
        w.setLastName(formData.lastName);
        w.setCellNbr(formData.cellNbr);
        w.setUserID(newUser.id);
        w.setDistrict(district);
        w.setRole(formData.role);
        w.setStatus('offline');
        if (formData.imgData !== '')
          return w
            .setImg(
              formData.imgData,
              `profile.${formData.imgType.replace('image/', '')}`
            )
            .then(() => w.save());
        return w.save();
      })
      .then((_) => {
        return Parse.User.logOut();
      })
      .then(() => {
        return Parse.User.become(sessionToken);
      });
    // todo: validate form
  };

  const onImageClick = (event) => {
    event.preventDefault();
    window.electron.ipcRenderer.invoke('chooseImage').then((resObj) => {
      console.log(resObj);
      if (resObj.imgData !== '') {
        setFormData({
          ...formData,
          imgData: resObj.imgData,
          imgType: resObj.type,
        });
      }
    });
  };

  return (
    <div>
      <form>
        <img
          src={
            formData.imgData !== ''
              ? `data:${formData.imgType};base64,${formData.imgData}`
              : ''
          }
          alt="profile"
        />
        <button type="submit" onClick={onImageClick}>
          Choose Image
        </button>
        <label>First Name</label>
        <input
          type="text"
          value={formData.firstName}
          name="firstName"
          onChange={handleChange}
        />
        <label>Last Name</label>
        <input
          type="text"
          value={formData.lastName}
          name="lastName"
          onChange={handleChange}
        />
        <label>Email</label>
        <input
          type="text"
          value={formData.email}
          name="email"
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="text"
          value={formData.pass}
          name="pass"
          onChange={handleChange}
        />
        <label>Confirm Password</label>
        <input
          type="text"
          value={formData.confirmPass}
          name="confirmPass"
          onChange={handleChange}
        />
        <label>Cell Nbr</label>
        <input
          type="text"
          value={formData.cellNbr}
          name="cellNbr"
          onChange={handleChange}
        />
        <label>Role:</label>
        <select name="role" onChange={handleChange}>
          <option value="base_worker">Base Worker</option>
          <option value="field_worker">Field Worker</option>
          <option value="district_chief">District Chief</option>
        </select>
        <button type="submit" onClick={onSave}>
          Register
        </button>
      </form>
    </div>
  );
}
