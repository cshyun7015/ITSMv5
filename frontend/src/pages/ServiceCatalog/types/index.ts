export type ServiceCatalog = {
  id: number;
  catalogName: string;
  description: string;
  category: string;
  icon: string;
  ownerId?: string;
  ownerName?: string;
  fulfillmentGroup?: string;
  slaHours?: number;
  estimatedCost?: number;
  defaultUrgency?: string;
  isPublished: boolean;
  fields: FormField[];
  company?: {
    companyId: string;
    companyName: string;
  };
};

export type FormField = {
  id?: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT' | 'CHECKBOX' | 'textarea';
  isRequired: boolean;
  fieldOrder: number;
  fieldOptions?: string; // JSON string from backend
};
