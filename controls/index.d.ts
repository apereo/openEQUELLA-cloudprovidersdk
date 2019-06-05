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

interface CloudAttachment extends BaseAttachment {
  type: "cloud";
  providerId: string;
  vendorId: string;
  cloudType: string;
  display?: object;
  meta?: object;
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

type EditXML = (edit: (doc: XMLDocument) => XMLDocument) => void;

type ItemCommandResponse =
  | AddAttachmentResponse
  | EditAttachmentResponse
  | DeleteAttachmentResponse;

type ControlValidator = (
  editXml: EditXML,
  setRequired: (required: boolean) => void
) => boolean;

interface ControlApi<T extends object> extends ControlParameters<T> {
  xml: XMLDocument;
  attachments: Attachment[];
  files: FileEntries;
  stagingId: string;
  userId: string;
  editXml: EditXML;
  apiVersion: { major: number; minor: number; patch: number };
  edits(edits: ItemCommand[]): Promise<ItemCommandResponse[]>;
  subscribeUpdates(callback: (doc: ItemState) => void): void;
  unsubscribeUpdates(callback: (doc: ItemState) => void): void;
  uploadFile(filepath: string, f: File): Promise<void>;
  deleteFile(filepath: string): Promise<void>;
  registerNotification(): void;
  registerValidator(validator: ControlValidator): void;
  deregisterValidator(validator: ControlValidator): void;
  providerUrl(serviceId: string): string;
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
