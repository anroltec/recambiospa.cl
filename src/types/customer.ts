export type CustomerProfileStatus = "draft" | "complete" | "verified";
export type CustomerDocumentType = "boleta" | "factura";

export interface CustomerCompanyProfile {
  shopifyCustomerId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  documentType: CustomerDocumentType;
  rut: string | null;
  razonSocial: string | null;
  giro: string | null;
  billingAddressId: string | null;
  billingAddressLine1: string | null;
  billingAddressLine2: string | null;
  billingComuna: string | null;
  billingCity: string | null;
  billingRegion: string | null;
  billingPostalCode: string | null;
  billingCountryCode: string | null;
  billingNotes: string | null;
  profileStatus: CustomerProfileStatus;
}

export interface CustomerCompanyProfileInput {
  firstName: string;
  lastName: string;
  phone: string;
  documentType: CustomerDocumentType;
  rut: string;
  razonSocial: string;
  giro: string;
  billingAddressLine1: string;
  billingAddressLine2?: string;
  billingComuna: string;
  billingCity: string;
  billingRegion?: string;
  billingPostalCode?: string;
  billingCountryCode?: string;
  billingNotes?: string;
}

export interface CustomerOrderLineItem {
  title: string;
  quantity: number;
}

export interface CustomerOrderSummary {
  id: string;
  name: string;
  processedAt: string | null;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  statusUrl: string | null;
  currencyCode: string;
  totalAmount: string;
  itemCount: number;
  lineItems: CustomerOrderLineItem[];
}

export interface CustomerOrdersPage {
  orders: CustomerOrderSummary[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}
