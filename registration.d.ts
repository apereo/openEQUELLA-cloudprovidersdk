interface OAuthCredentials {
  clientId: string;
  clientSecret: string;
}

interface ServiceUrl {
  url: string;
  authenticated: boolean;
}

interface ViewerMap {
  [viwerId: string]: { name: string; serviceId: string };
}

export interface ProviderRegistration {
  /**
   * The name of your Cloud Provider
   */
  name: string;
  /**
   * Optional description
   */
  description?: string;
  /**
   * An optional icon which will show in the openEQUELLA cloud provider list.
   */
  iconUrl?: string;
  /**
   * The vendor id should be a short string which is globally unique.
   * For example it could be the name of your organization. It is referenced
   * in a few places, most notably as part of cloud wizard control registration.
   */
  vendorId: String;
  /**
   * A base URL which can be referenced from your service URL map.
   */
  baseUrl: string;
  /**
   * The OAuth client credentials with which openEQUELLA can use to authenticate
   * requests to your cloud provider.
   */
  providerAuth: OAuthCredentials;
  /**
   * The service URL map.
   * This map contains template strings for generating URLs to
   * your cloud provider service, some of which are predefined
   * services which openEQUELLA will use to query for
   * extensions (such as wizard controls). You can also list URLs
   * to authenticated private services which openEQUELLA can call in
   * a secure manner.
   */
  serviceUrls: { [serviceId: string]: ServiceUrl };
  /**
   * The attachment viewer map.
   * Cloud providers can extend openEQUELLA with their own
   * custom attachment type(s). In order to support viewing these attachments,
   * you must provide an entry in this map which lists at least a default viewer
   * service for your attachment.
   */
  viewers: { [attachmentType: string]: ViewerMap };
}

interface ProviderRegistrationInstance extends ProviderRegistration {
  id: string;
  oeqAuth: OAuthCredentials;
}

interface ProviderRegistrationResponse {
  instance: ProviderRegistrationInstance;
  forwardUrl: string;
}

interface ProviderRefreshRequest {
  id: string;
}
