export interface ServiceCatalog {
  id: number;
  catalogName: string;
  description: string;
  category: string;
  icon: string;
  formSchema: string;
  isPublished: boolean;
  tenant?: {
    tenantId: string;
    tenantName: string;
  };
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox';
  options?: string[];
}
