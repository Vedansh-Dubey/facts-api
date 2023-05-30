import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInputComponent = ({ phone, handlePhoneChange }) => {
  return (
    <PhoneInput country={'in'} value={phone} onChange={handlePhoneChange} />
  );
};

export default PhoneInputComponent;
