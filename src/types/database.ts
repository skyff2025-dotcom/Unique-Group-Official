export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string;
          title: string;
          slug: string;
          property_type: string;
          listing_type: string;
          location: string;
          city: string;
          district: string;
          area: number | string;
          area_unit: string;
          price: number | null;
          price_display: string | null;
          description: string;
          short_description: string | null;
          status: string;
          featured: boolean;
          bedrooms: number | null;
          bathrooms: number | null;
          google_maps_url: string | null;
          latitude: number | null;
          longitude: number | null;
          contact_phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          property_type: string;
          listing_type?: string;
          location: string;
          city?: string;
          district?: string;
          area: number | string;
          area_unit?: string;
          price?: number | null;
          price_display?: string | null;
          description: string;
          short_description?: string | null;
          status?: string;
          featured?: boolean;
          bedrooms?: number | null;
          bathrooms?: number | null;
          google_maps_url?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          contact_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          property_type?: string;
          listing_type?: string;
          location?: string;
          city?: string;
          district?: string;
          area?: number | string;
          area_unit?: string;
          price?: number | null;
          price_display?: string | null;
          description?: string;
          short_description?: string | null;
          status?: string;
          featured?: boolean;
          bedrooms?: number | null;
          bathrooms?: number | null;
          google_maps_url?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          contact_phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      property_images: {
        Row: {
          id: string;
          property_id: string;
          image_url: string;
          storage_path: string | null;
          alt_text: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          image_url: string;
          storage_path?: string | null;
          alt_text?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          image_url?: string;
          storage_path?: string | null;
          alt_text?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          }
        ];
      };

      insurance_companies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          short_description: string | null;
          description: string | null;
          website_url: string | null;
          phone: string | null;
          email: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          short_description?: string | null;
          description?: string | null;
          website_url?: string | null;
          phone?: string | null;
          email?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          short_description?: string | null;
          description?: string | null;
          website_url?: string | null;
          phone?: string | null;
          email?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      insurance_plans: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          slug: string;
          category: string;
          short_description: string | null;
          description: string | null;
          key_benefits: Json | null;
          eligibility: string | null;
          documents_required: Json | null;
          contact_phone: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          slug: string;
          category: string;
          short_description?: string | null;
          description?: string | null;
          key_benefits?: Json | null;
          eligibility?: string | null;
          documents_required?: Json | null;
          contact_phone?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          slug?: string;
          category?: string;
          short_description?: string | null;
          description?: string | null;
          key_benefits?: Json | null;
          eligibility?: string | null;
          documents_required?: Json | null;
          contact_phone?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "insurance_plans_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "insurance_companies";
            referencedColumns: ["id"];
          }
        ];
      };

      finance_companies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          short_description: string | null;
          description: string | null;
          website_url: string | null;
          phone: string | null;
          email: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          short_description?: string | null;
          description?: string | null;
          website_url?: string | null;
          phone?: string | null;
          email?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          short_description?: string | null;
          description?: string | null;
          website_url?: string | null;
          phone?: string | null;
          email?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      finance_services: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          slug: string;
          category: string;
          short_description: string | null;
          description: string | null;
          eligibility: string | null;
          documents_required: Json | null;
          contact_phone: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          slug: string;
          category: string;
          short_description?: string | null;
          description?: string | null;
          eligibility?: string | null;
          documents_required?: Json | null;
          contact_phone?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          slug?: string;
          category?: string;
          short_description?: string | null;
          description?: string | null;
          eligibility?: string | null;
          documents_required?: Json | null;
          contact_phone?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "finance_services_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "finance_companies";
            referencedColumns: ["id"];
          }
        ];
      };

      services: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category: string;
          description: string;
          image_url: string | null;
          active: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          category: string;
          description: string;
          image_url?: string | null;
          active?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          category?: string;
          description?: string;
          image_url?: string | null;
          active?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      testimonials: {
        Row: {
          id: string;
          customer_name: string;
          message: string;
          rating: number | null;
          location: string | null;
          active: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          message: string;
          rating?: number | null;
          location?: string | null;
          active?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          message?: string;
          rating?: number | null;
          location?: string | null;
          active?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      enquiries: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          service_type: string;
          property_id: string | null;
          insurance_plan_id: string | null;
          finance_service_id: string | null;
          message: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          service_type: string;
          property_id?: string | null;
          insurance_plan_id?: string | null;
          finance_service_id?: string | null;
          message?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          service_type?: string;
          property_id?: string | null;
          insurance_plan_id?: string | null;
          finance_service_id?: string | null;
          message?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "enquiries_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enquiries_insurance_plan_id_fkey";
            columns: ["insurance_plan_id"];
            isOneToOne: false;
            referencedRelation: "insurance_plans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enquiries_finance_service_id_fkey";
            columns: ["finance_service_id"];
            isOneToOne: false;
            referencedRelation: "finance_services";
            referencedColumns: ["id"];
          }
        ];
      };

      site_settings: {
        Row: {
          id: string;
          business_name: string;
          tagline: string;
          phone: string;
          whatsapp: string | null;
          email: string | null;
          address: string;
          google_maps_url: string | null;
          instagram_url: string | null;
          facebook_url: string | null;
          logo_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name: string;
          tagline: string;
          phone: string;
          whatsapp?: string | null;
          email?: string | null;
          address: string;
          google_maps_url?: string | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          logo_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_name?: string;
          tagline?: string;
          phone?: string;
          whatsapp?: string | null;
          email?: string | null;
          address?: string;
          google_maps_url?: string | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          logo_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      admin_profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          role: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          role?: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          role?: string;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type PropertyRow = Database['public']['Tables']['properties']['Row'];
export type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
export type PropertyUpdate = Database['public']['Tables']['properties']['Update'];

export type PropertyImageRow = Database['public']['Tables']['property_images']['Row'];
export type PropertyImageInsert = Database['public']['Tables']['property_images']['Insert'];
export type PropertyImageUpdate = Database['public']['Tables']['property_images']['Update'];

export type InsuranceCompanyRow = Database['public']['Tables']['insurance_companies']['Row'];
export type InsuranceCompanyInsert = Database['public']['Tables']['insurance_companies']['Insert'];
export type InsuranceCompanyUpdate = Database['public']['Tables']['insurance_companies']['Update'];

export type InsurancePlanRow = Database['public']['Tables']['insurance_plans']['Row'];
export type InsurancePlanInsert = Database['public']['Tables']['insurance_plans']['Insert'];
export type InsurancePlanUpdate = Database['public']['Tables']['insurance_plans']['Update'];

export type FinanceCompanyRow = Database['public']['Tables']['finance_companies']['Row'];
export type FinanceCompanyInsert = Database['public']['Tables']['finance_companies']['Insert'];
export type FinanceCompanyUpdate = Database['public']['Tables']['finance_companies']['Update'];

export type FinanceServiceRow = Database['public']['Tables']['finance_services']['Row'];
export type FinanceServiceInsert = Database['public']['Tables']['finance_services']['Insert'];
export type FinanceServiceUpdate = Database['public']['Tables']['finance_services']['Update'];

export type GeneralServiceRow = Database['public']['Tables']['services']['Row'];
export type ServiceRow = GeneralServiceRow;
export type GeneralServiceInsert = Database['public']['Tables']['services']['Insert'];
export type GeneralServiceUpdate = Database['public']['Tables']['services']['Update'];

export type TestimonialRow = Database['public']['Tables']['testimonials']['Row'];
export type TestimonialInsert = Database['public']['Tables']['testimonials']['Insert'];
export type TestimonialUpdate = Database['public']['Tables']['testimonials']['Update'];

export type EnquiryRow = Database['public']['Tables']['enquiries']['Row'];
export type EnquiryInsert = Database['public']['Tables']['enquiries']['Insert'];
export type EnquiryUpdate = Database['public']['Tables']['enquiries']['Update'];

export type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];
export type SiteSettingsInsert = Database['public']['Tables']['site_settings']['Insert'];
export type SiteSettingsUpdate = Database['public']['Tables']['site_settings']['Update'];

export type AdminProfileRow = Database['public']['Tables']['admin_profiles']['Row'];
export type AdminProfileInsert = Database['public']['Tables']['admin_profiles']['Insert'];
export type AdminProfileUpdate = Database['public']['Tables']['admin_profiles']['Update'];
