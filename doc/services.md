# openEQUELLA services

In order for cloud providers to extend the functionality of openEQUELLA, it is necessary for your registration metadata to provide service URI mappings for some special endpoints.

## URI templates

TODO

## oauth

If your cloud provider needs requests to be authenticated, you can provide a mapping under "oauth" which should be an OAuth token supplying endpoint that can accept "client_credentials" grant requests (see the [RFC](https://tools.ietf.org/html/rfc6749#section-4.4)).

## controls

If your cloud provider wishes to provide extra wizard control(s), you must provide a mapping to an endpoint which can return a list of supported controls and associated configuration options. openEQUELLA will perform a POST to this URL and expect control configuration in JSON as defined [here](../controls.d.ts) (see `CloudControls`):

## refresh

If you would like to support allowing administrators to manually trigger a refresh of the registration data, you can supply a mapping for this service which will receieve a JSON POST containing a `ProviderRefreshRequest`:

```json
{
  "id": "providerID"
}
```

The endpoint must return JSON in the same format as was used to register in the first place. [here](../registration.d.ts) (`ProviderRegistration`)

## itemNotification

TODO
