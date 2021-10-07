import React, { useEffect, useState } from 'react';

export default function AddMemberScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    pass: '',
    confirmPass: '',
    cellNbr: '',
  });

  useEffect(() => {
    // check current user role.
  }, []);

  const handleChange = (evt) => {
    const { value } = evt.target;
    setFormData({ ...formData, [evt.target.name]: value });
  };

  const onSave = () => {
    // todo: validate form
  };

  return (
    <div>
      <form>
        <input
          type="text"
          value={formData.firstName}
          name="firstName"
          onChange={handleChange}
        />
        <input
          type="text"
          value={formData.lastName}
          name="lastName"
          onChange={handleChange}
        />
        <input
          type="text"
          value={formData.email}
          name="email"
          onChange={handleChange}
        />
        <input
          type="text"
          value={formData.pass}
          name="pass"
          onChange={handleChange}
        />
        <input
          type="text"
          value={formData.confirmPass}
          name="confirmPass"
          onChange={handleChange}
        />
        <input
          type="text"
          value={formData.cellNbr}
          name="cellNbr"
          onChange={handleChange}
        />
        <button type="submit" onClick={onSave}>
          Register
        </button>
      </form>
    </div>
  );
}
