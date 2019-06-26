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
  "display": {
    "Studio": "Paramount"
  },
  "meta": {
    "imdbid": "tt0120338"
  },
  "indexText": "These words will be searchable",
  "indexFiles": ["transcript.txt"]
}
```

- `type` must be `"cloud"`
- `providerId` - can be retrieved from `api.providerId`, it will be used to lookup the viewer map.
- `vendorId` - can be retrieved from `api.vendorId`, currently unused but would be useful for future functionality to re-attach attachments if attachments become orphaned from a cloud provider.
- `display` - a JSON object with keys being strings displayed to the user in the attachments section on the summary page. Currently supported values are strings and numbers.
- `meta` - this metadata is available as parameters to the viewer service URL.
- `indexText` - The text will be indexed against the item and be available for searching.
- `indexFiles` - This is a list of files contained within the items file area which are also indexed against the item.

## Viewing cloud provider attachments

If your attachment is to support viewing (e.g. clicking on the attachment link and opening something that your browser can view / download), the cloud provider registration needs to provide an entry in `viewers` map containing at least a default viewer. Here is an example snippet for adding a viewer to the example attachment which would redirect them to the IMDB page.

```json
{
  "serviceUrls": {
    "imdbviewer": {
      "url": "https://www.imdb.com/title/${imdbid}/",
      "authenticated": false
    }
  },
  "viewers": {
    "omdb": {
      "": {
        "name": "Default viewer",
        "serviceId": "imdbviewer"
      }
    }
  }
}
```

If the service URL is marked as `"authenticated": false` the browser will be redirected to the resulting URL directly. If you need to support secure viewing however, you can set the flag to `true` and openEQUELLA will proxy the request to your service using the providers OAuth credentials.

Please note openEQUELLA checks permissions for the item/attachment before attempting to forward or proxy any request.
