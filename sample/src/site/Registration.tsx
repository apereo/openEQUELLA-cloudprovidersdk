import React from "react";
import Axios from "axios";
import { ProviderRegistrationResponse } from "oeq-cloudproviders/registration";
import { providerRegistration } from "../shared/registration";

export default () => {
  const params = new URLSearchParams(document.location.search);
  const registration = params.get("register");
  const institution = params.get("institution");
  if (registration && institution) {
    function registerProvider() {
      Axios.post<ProviderRegistrationResponse>(
        institution + registration,
        providerRegistration()
      ).then(res => (window.location.href = res.data.forwardUrl));
    }
    return (
      <>
        <div>Institution {institution} would like to register us.</div>
        <button onClick={registerProvider}>Confirm</button>
      </>
    );
  } else {
    return <div />;
  }
};
