import React from 'react';
import OTPInput from 'otp-input-react';

const OTPInputComponent = ({ OTP, handleOTPChange, handleVerify }) => {
  return (
    <OTPInput
      value={OTP}
      onChange={handleOTPChange}
      autoFocus
      OTPLength={6}
      otpType="number"
      disabled={false}
    />
  );
};

export default OTPInputComponent;
