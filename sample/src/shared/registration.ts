import { ProviderRegistration } from "oeq-cloudproviders/registration";

export const vendorId = "myvendor";

export function providerRegistration(): ProviderRegistration {
  return {
    name: "My Cloud Provider",
    description: "My sample cloud provider, including a wizard control",
    vendorId,
    baseUrl: "http://localhost:5000/",
    iconUrl:
      "https://user-images.githubusercontent.com/4625498/55527161-8591ca80-56e3-11e9-8865-ca7c3bc5b7f2.gif",
    providerAuth: {
      clientId: "universityid",
      clientSecret: "universitysecret"
    },
    serviceUrls: {
      oauth: {
        url: "${baseUrl}oauthtoken",
        authenticated: false
      },
      refresh: {
        url: "${baseUrl}refresh",
        authenticated: false
      },
      controls: {
        url: "${baseUrl}controls",
        authenticated: false
      },
      control_omdb: {
        url: "${baseUrl}omdb.js",
        authenticated: false
      },
      imdbviewer: {
        url: "https://www.imdb.com/title/${imdbID}/",
        authenticated: false
      }
    },
    viewers: {
      omdb: {
        "": {
          name: "Default viewer",
          serviceId: "imdbviewer"
        }
      }
    }
  };
}
