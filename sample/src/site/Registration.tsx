import React from "react";
import Axios from "axios";
import {
  ProviderRegistration,
  ProviderRegistrationResponse
} from "../../../registration";

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
        <div>Register {registration}</div>
        <div>Institution {institution}</div>
        <button onClick={registerProvider}>Register</button>
      </>
    );
  } else {
    return <div />;
  }
};

function providerRegistration(): ProviderRegistration {
  return {
    name: "My Cloud Provider",
    description: "My sample cloud provider, including wizard controls",
    vendorId: "myvendor",
    baseUrl: "http://localhost:5000/",
    iconUrl:
      "https://user-images.githubusercontent.com/4625498/55527161-8591ca80-56e3-11e9-8865-ca7c3bc5b7f2.gif",
    providerAuth: {
      clientId: "universityid",
      clientSecret: "universitysecret"
    },
    serviceUris: {
      oauth: {
        uri: "${baseurl}oauthtoken",
        authenticated: false
      },
      controls: {
        uri: "${baseurl}controls",
        authenticated: false
      },
      control_omdb: {
        uri: "${baseurl}omdb.js",
        authenticated: false
      }
    },
    viewers: {
      myattachment: {
        "": {
          name: "Default viewer",
          serviceId: "viewattachment"
        }
      }
    }
  };
}
