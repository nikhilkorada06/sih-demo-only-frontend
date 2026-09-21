export interface Department {
  _id: string;
  name: string;
  code: string;
  description?: string;
  active: boolean;
  dataCategories: string[];
  serviceCount?: number;
  icon?: string;
  frontendUrl?: string;
  backendUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Integration {
  _id: string;
  departmentId: string;
  name: string;
  protocol: 'REST' | 'SOAP' | 'GRAPHQL';
  baseUrl: string;
  active: boolean;
  authentication: {
    type: 'NONE' | 'API_KEY' | 'JWT';
    apiKey?: { headerName: string; value: string };
    jwt?: { tokenUrl: string; clientId: string; clientSecret: string; scopes?: string[] };
  };
}
