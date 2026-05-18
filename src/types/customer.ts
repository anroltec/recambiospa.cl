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

export interface CustomerOrderAddress {
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  country: string | null;
  countryCode: string | null;
  phone: string | null;
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

export interface CustomerOrderDetailLineItem {
  id: string;
  title: string;
  name: string;
  quantity: number;
  sku: string | null;
  vendor: string | null;
  variantTitle: string | null;
  unitPriceAmount: string;
  linePriceAmount: string;
  currencyCode: string;
  imageUrl: string | null;
  imageAlt: string | null;
}

export interface CustomerOrderDetail {
  id: string;
  currencyCode: string;
  subtotalAmount: string;
  shippingAmount: string;
  taxAmount: string;
  totalAmount: string;
  totalQuantity: number;
  email: string | null;
  phone: string | null;
  note: string | null;
  shippingMethodTitle: string | null;
  billingAddress: CustomerOrderAddress | null;
  shippingAddress: CustomerOrderAddress | null;
  lineItems: CustomerOrderDetailLineItem[];
}

export interface CustomerOrdersPage {
  orders: CustomerOrderSummary[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}
