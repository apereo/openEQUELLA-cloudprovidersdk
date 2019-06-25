# Wizard controls

openEQUELLA gives cloud providers the ability to embed their own wizard controls into a contribution wizard by allowing them to supply a JSON object which contains wizard control definitions. Here is a sample controls definitinon object:

```json
{
  "omdb": {
    "name": "OMDB Lookup",
    "configuration": [
      {
        "id": "apiKey",
        "name": "API Key",
        "configType": "Textfield",
        "min": 1
      }
    ]
  }
}
```

- `omdb` is the wizard control id.
- `OMDB Lookup` is what will show in the admin console when an admin tries to add a new control to a page.
- There is one configuration element for the control with an id of `apiKey`, name of `API Key` and control type of `Textfield`.
- Setting `min` to 1 will force the config element to be mandatory.

Each configuration element can be marked as one of several different control types:

- `Textfield`
- `Dropdown`
- `Check`
- `Radio`
- `XPath` - Allow the user to select path(s) from the collection's schema.

For `Dropdown`, `Check` and `Radio` you must also supply a list of name/value options for the admin to select from, for example:

```json
{
  "controlId": {
    "name": "My Control",
    "configuration": [
      {
        "id": "team",
        "name": "Favourite team",
        "configType": "Check",
        "options": [
          { "name": "Essendon", "value": "ess" },
          { "name": "Collingwood", "value": "notpossible" }
        ]
      }
    ]
  }
}
```

## Wizard control Javascript bundle

In order for you to implement your wizard control, your cloud provider must provide a service mapping to point to a javascript file which contains the implementation for the control. The id for the service is created by prepending `control_` to the control id. So for the `omdb` example above it would be `control_omdb`.

```json
 "serviceUris": {
    "control_omdb": {
      "uri": "${baseurl}omdb.js",
      "authenticated": false
    }
  }
```

**NOTE:** Wizard control javascript bundles don't support authentication as they need to be cached by the browser in order to be effecient.

## Registering your control code

In order to interact with the openEQUELLA wizard page, your Javascript bundle must register itself by calling a global registration function, supplying it:

- The cloud provider vendor id that you used when registering the cloud provider.
- The control id (e.g. `omdb`)
- A `mount` function which is called when the wizard needs to render the control.
- An `unmount` function which is called if the control is removed or hidden.

The `mount` function takes as an argument an instance of `ControlApi` which contains the properties (amongst other things):

- `title` - The title of the control as selected by the administrator.
- `element` - The DOM element which your control must render itself into.
- `config` - The configuration data which was entered into the admin console.

A basic Hello World implementation using [React](https://reactjs.org/) could be:

```typescript
import * as ReactDOM from "react-dom";
import * as React from "react";
import { ControlApi } from "oeq-cloudproviders/controls";

CloudControl.register(
  "myvendor",
  "omdb",
  api =>
    ReactDOM.render(
      <div className="control">
        <h3>{api.title}</h3>
      </div>,
      api.element
    ),
  ReactDOM.unmountComponentAtNode
);
```

## Accessing control configuration data

Each configuration option specified in the controls definition object will have an entry for the `id` property with the value type being determined by the `controlType`:

- `Textfield` a string value
- `XPath` an array of string path(s)
- `Check`, `Dropdown` & `Radio` - an array of strings of selected value(s)

Example:

```typescript
config: {
  apiKey: "theApiKey",
  team: ["ess"],
  xpath: ["/item/data", "/item/another/path"]
}
```

## Metadata, files and attachments

Initially when your `mount` function is called, the `ControlApi` object will contain the current XML metadata, file listing and attachment list. Along with these properties, there are functions for editing the XML, adding/removing attachments and uploading/deleting files:

- `xml` - The metadata as a DOM XMLDocument.
- `attachments` - An array of attachments contained in this item (in openEQUELLA REST API format).
- `files` - An object providing a list of all the files currently uploaded to the item.
- `editXML(edit: (doc: XMLDocument) => XMLDocument)` - A function which takes a callback to edit the XMLDocument.
- `edits(edits: ItemCommand[])` - A function which can add/edit/delete attachments and their associated metadata node.
- `uploadFile() + deleteFile()` - Manipulating the items file staging area.

Because there maybe be other controls on the page that can manipulate the item's metadata, attachments and files, it is a good practice to register your cloud provider to receive update notifications when the item's state has changed.

This is achieved by calling `subscribeUpdates(callback: (doc: ItemState) => void)` with an appropriate callback.

Being aware of changes in this way means that your control could immediately react to a new file being uploaded and send a notification off to one of yours services triggered it to be analyzed.

## Notifying your cloud provider on item save

Some operations that your cloud provider could perform might be unsuitable for being actioned in real-time during the wizard contribution (e.g. Transcoding a video).

In this case you will need openEQUELLA to send your cloud provider a notification upon finishing the wizard, providing the cloud provider with the UUID/version of the saved item which can later be edited asynchronously (e.g. after Transoding finishes).

To ensure your cloud provider will receive a notification your cloud control must call `registerNotification()` on the `ControlApi` object.

This will trigger a POST to `itemNotification` service with `uuid` and `version` parameters available to the URL mapping.

## Validation

Sometimes wizard controls need to alert the user when they have entered invalid and/or missing data. Cloud controls can register a `ControlValidator` which is called when the page is submitted, which will happen when navigating through pages or saving.

```typescript
type ControlValidator = (
  editXml: EditXML,
  setRequired: (required: boolean) => void
) => boolean;

registerValidator(validator: ControlValidator): void;
```

The `ControlValidator` is a function which takes two parameters and returns a boolean. The first parameter allows you to edit the XML prior to the page being submitted, the second is a callback which can be used to alert the user that the control isn't finished, either because it's invalid or it needs to be filled in. The required flag persist throughout the wizard, so even if you are on a different page and the user tries to save, they will be asked to return to the page with your invalid control unless they want to save as a draft. Please note that it is the responsibility of the control itself to render inline validation error messages.

The boolean return value is whether or not the control is valid enough to allow the page submission to continue. You would only ever return `false` here if your control was in the middle of an action that needs to complete, for example uploading a file would be a good use case.

## Talking to your own services

A common use case for a cloud wizard control would be to call off to your own hosted service in order to process data / content outside of the browser in a secure way.

In order to facilitate this, the cloud control must call `providerUrl("<myserviceId>")` to get a base URL which can be used to GET or POST a request to. You can add your own query parameters to the URL you get back and these will be passed into the service URL template parameter map for the service ID you passed in.

If the request needs authentication (`authentication` flag is true), openEQUELLA will attempt to use/retrieve an OAuth token and use with the request.

Here is an example service which accepts the staging ID and a filename in order to do some processing, lets say scanning for viruses.

```json
{
  "serviceUris": {
    "scanService": {
      "uri": "${baseurl}scan/${stagingid}/${filename}",
      "authenticated": true
    }
  }
}
```

Could be called in the wizard control in this manner:

```typescript
const serviceUrl =
  api.providerUrl("scanService") +
  "?stagingid=" +
  encodeURIComponent(api.stagingId) +
  "&filename=" +
  encodeURIComponent(filename);

axios.get(serviceUrl).then(/* process response */);
```
