# openEQUELLA Cloud Provider Attachments

Along with wizard controls, openEQUELLA has introduced a new type of attachment which supports viewing via Cloud Provider service URL(s). They can be added/edited during contribution via the [Cloud Control API](../controls.d.ts) and also via REST using the standard item editing REST endpoints.

```json
{
  "uuid": "<UUID>",
  "description": "Titanic",
  "viewer": "",
  "type": "cloud",
  "providerId": "<PROVIDERID>",
  "vendorId": "myvendor",
  "cloudType": "omdb",
  "display": {},
  "meta": {},
  "indexText": "",
  "indexFiles": []
}
```

TODO: fill in and describe
