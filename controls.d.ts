interface BaseAttachment {
  uuid?: string;
  description: string;
  viewer?: string;
  preview?: boolean;
}

interface FileAttachment extends BaseAttachment {
  type: "file";
  filename: string;
}

interface UrlAttachment extends BaseAttachment {
  type: "url";
  url: string;
}

interface YoutubeAttachment extends BaseAttachment {
  type: "youtube";
  videoId: string;
  uploadedDate: Date;
}

interface CloudAttachment<Meta extends object = object> extends BaseAttachment {
  type: "cloud";
  providerId: string;
  vendorId: string;
  cloudType: string;
  display?: object;
  meta?: Meta;
  indexText?: string;
  indexFiles?: string[];
}

type Attachment =
  | FileAttachment
  | UrlAttachment
  | YoutubeAttachment
  | CloudAttachment;

interface AddAttachment {
  command: "addAttachment";
  attachment: Attachment;
  xmlPath?: string;
}

interface EditAttachment {
  command: "editAttachment";
  attachment: Attachment;
}

interface DeleteAttachment {
  command: "deleteAttachment";
  uuid: string;
  xmlPath?: string;
}

type ItemCommand = AddAttachment | EditAttachment | DeleteAttachment;

interface ControlParameters<T extends object> {
  vendorId: string;
  controlType: string;
  providerId: string;
  title: string;
  ctrlId: string;
  element: HTMLElement;
  reload: () => void;
  config: T;
}

interface ItemState {
  xml: XMLDocument;
  attachments: Attachment[];
  files: FileEntries;
  stateVersion: number;
}

interface AddAttachmentResponse {
  type: "added";
  attachment: Attachment;
}

interface EditAttachmentResponse {
  type: "edited";
  attachment: Attachment;
}

interface DeleteAttachmentResponse {
  type: "deleted";
  uuid: string;
}

interface FileEntries {
  [x: string]: FileEntry;
}

interface FileEntry {
  size: number;
  files?: FileEntries;
}

type EditXMLFunc = (edit: (doc: XMLDocument) => XMLDocument) => void;

type ItemCommandResponse =
  | AddAttachmentResponse
  | EditAttachmentResponse
  | DeleteAttachmentResponse;

type ControlValidator = (
  editXml: EditXMLFunc,
  setRequired: (required: boolean) => void
) => boolean;

interface ControlApi<T extends object = object> extends ControlParameters<T> {
  /**
   * The current API version.
   */
  apiVersion: { major: number; minor: number; patch: number };
  /**
   * The XML metadata when your control was initialized.
   */
  xml: XMLDocument;
  /**
   * The list of attachments (in REST API format), when your control was initialized.
   */
  attachments: Attachment[];
  /**
   * The tree of file entries contained in this item, when your control was initialized.
   */
  files: FileEntries;
  /**
   * The staging id of the item being edited.
   */
  stagingId: string;
  /**
   * The user id of the user editing the item.
   */
  userId: string;
  /**
   * A function which takes a callback which edits XML metadata document.
   */
  editXml: EditXMLFunc;
  /**
   * A function which can be used to make changes to the attachment list
   * and optionally associated metadata path.
   * @param edits An array of `ItemCommand`s which can either create, edit or delete an attachment.
   * @returns A Promise with an array of corresponding response object giving the result of each command.
   */
  edits(edits: ItemCommand[]): Promise<ItemCommandResponse[]>;
  /**
   * Subscribe to updates to the ItemState (xml, attachments and files).
   * @param callback The callback to receive the state update
   */
  subscribeUpdates(callback: (doc: ItemState) => void): void;
  /**
   * Cancel an updates subscription.
   * @param callback The callback to remove
   */
  unsubscribeUpdates(callback: (doc: ItemState) => void): void;
  /**
   * Upload/overwrite a file in the staging area for this item.
   * @param filepath The filepath to upload to
   * @param f The file to upload
   */
  uploadFile(filepath: string, f: File): Promise<void>;
  /**
   * Delete a file from the staging area for this item.
   * @param filepath The filepath to delete
   */
  deleteFile(filepath: string): Promise<void>;
  /**
   * Register for the cloud provider to receieve a
   * notification to it's `itemNotification` service.
   */
  registerNotification(): void;
  /**
   * Register to participate in wizard control validation.
   * @param validator The `ControlValidator` to register
   */
  registerValidator(validator: ControlValidator): void;
  /**
   * De-register a previously registered validator.
   * This should be called if your control has been unmounted.
   * @param validator
   */
  deregisterValidator(validator: ControlValidator): void;
  /**
   * Get a URL which can be used to proxy requests from your control
   * back to your cloud provider service. The returned URL can have extra
   * parameters added to the end of it and they will be used as extra substitution
   * variables by the service URL mapper.
   * @param serviceId The cloud provider service you would like to call.
   * @returns A URL to either GET or POST to.
   */
  providerUrl(serviceId: string): string;
}

type CloudConfigConfigType =
  | "XPath"
  | "Textfield"
  | "Dropdown"
  | "Check"
  | "Radio";

interface CloudControlConfig {
  id: String;
  name: string;
  description?: string;
  configType: CloudConfigConfigType;
  options?: {
    name: string;
    value: string;
  }[];
  min?: number;
  max?: number;
}

interface CloudControlDefinition {
  name: string;
  iconUrl?: string;
  configuration: CloudControlConfig[];
}

export interface CloudControls {
  [controlId: string]: CloudControlDefinition;
}

export interface CloudControlRegister {
  register: <T extends object = object>(
    vendorId: string,
    controlId: string,
    mount: (api: ControlApi<T>) => void,
    unmount: (removed: Element) => void
  ) => void;
}

declare global {
  const CloudControl: CloudControlRegister;
}
