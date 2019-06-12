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

- `XPath`
- `Textfield`
- `Dropdown`
- `Check`
- `Radio`

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

**NOTE:** Control bundles don't support authentication as they need to be cached by the browser in order to be effecient.

## Registering your control code

In order to interact with the openEQUELLA wizard page, your Javascript bundle must register itself by calling a global registration function, supplying it:

- The cloud provider vendor id that you used when registering the cloud provider.
- The control id (e.g. `omdb`)
- A `mount` function which is called when the wizard needs to render the control.
- An `unmount` function which is called if the control is removed or hidden.

The `mount` function takes as an argument an instance of `ControlApi` which contains: properties containing (amongst other things),

- `title` - The title of the control as selected by the administrator.
- `element` - The DOM element which your control must render itself into
- `config` - The configuration data which was entered into the admin console.

The most basic implementation of a mount function could simply create a

current item state information such as XML metadata, file list and attachment list
