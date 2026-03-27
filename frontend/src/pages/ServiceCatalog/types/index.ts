export type ServiceCatalog = {
  id: number;
  catalogName: string;
  description: string;
  category: string;
  icon: string;
  formSchema: string;
  isPublished: boolean;
  company?: {
    companyId: string;
    companyName: string;
  };
};

export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox';
  options?: string[];
};
