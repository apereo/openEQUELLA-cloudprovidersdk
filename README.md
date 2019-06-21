# openEQUELLA Cloud Provider SDK

Cloud Providers are a way to extend openEQUELLA without having to modify the core code. In addition to this, as the name suggests, the extensions can be hosted on external servers by third parties.

Currently the ways in which Cloud Providers can extend openEQUELLA are in a few key areas:

- Contribution wizard controls
- Attachments and viewing them

In order to create a Cloud Provider which openEQUELLA administrators can register, you will need to run a web application which is capable of responding to a few pre-defined requests.

There is a sample implementation written in Typescript running on a NodeJS webserver located in the [sample](sample) subfolder.

## Creating your own Cloud Provider

1. [Registering a cloud provider](doc/registration.md)
2. [Cloud provider services](doc/services.md)
3. [Creating a wizard controls service](doc/controls.md)
4. [Cloud provider attachments](doc/attachments.md)
