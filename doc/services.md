# openEQUELLA services

In order for cloud providers to extend the functionality of openEQUELLA, it is necessary for your registration metadata to provide service URL mappings for some special endpoints.

## URL templates

Some communication with the cloud provider might require more context than just the supplied oauth credentials.
For example, if your cloud provider is responding to requests to view attachments, it might be interested in knowing the user id of the user who is viewing it. In order to support this use case, each URL template is supplied a map of parameters which can be substituted into the URL string. Depending on which service URL is being generated you will get a different set of parameters but there is a common set which is available to all URL templates:

| Parameter | Contents                                                 |
| --------- | -------------------------------------------------------- |
| `userid`  | The ID of the current openEQUELLA user                   |
| `baseurl` | The base url supplied in the cloud provider registration |

## oauth (POST)

If your cloud provider needs requests to be authenticated, you can provide a mapping under "oauth" which should be an OAuth token supplying endpoint that can accept "client_credentials" grant requests (see the [RFC](https://tools.ietf.org/html/rfc6749#section-4.4)).

## controls (GET)

If your cloud provider wishes to provide extra wizard control(s), you must provide a mapping to an endpoint which can return a list of supported controls and associated configuration options. openEQUELLA will perform a GET to this URL and expect control configuration in JSON as defined [here](../controls.d.ts) (see `CloudControls`):

## refresh (POST)

If you would like to support allowing administrators to manually trigger a refresh of the registration data, you can supply a mapping for this service which will receieve a JSON POST containing a `ProviderRefreshRequest`:

```json
{
  "id": "providerID"
}
```

The endpoint must return JSON in the same format as was used to register in the first place. [here](../registration.d.ts) (`ProviderRegistration`)

## itemNotification (POST)

Cloud wizard controls can register to be advised of when an item has been saved, allowing the cloud provider to do asynchronous processing. The uuid and version are passed in as URL template parameters. The POST will have an empty body.

| Parameter | Contents                                      |
| --------- | --------------------------------------------- |
| `uuid`    | The UUID of the item that was saved           |
| `version` | The version number of the item that was saved |

## control\_{controlType} (GET)

Each control type has a service URL entry which is used to generate a `<script>` tag for inclusion in the wizard page.
