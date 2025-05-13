export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      certificats: {
        Row: {
          date_emission: string | null
          date_expiration: string
          dossier_id: string | null
          emis_par: string | null
          entreprise: string
          fichier_url: string | null
          id: string
          norme: string | null
          numero: string
          produit: string
          signature_url: string | null
          status: string
        }
        Insert: {
          date_emission?: string | null
          date_expiration: string
          dossier_id?: string | null
          emis_par?: string | null
          entreprise: string
          fichier_url?: string | null
          id?: string
          norme?: string | null
          numero: string
          produit: string
          signature_url?: string | null
          status?: string
        }
        Update: {
          date_emission?: string | null
          date_expiration?: string
          dossier_id?: string | null
          emis_par?: string | null
          entreprise?: string
          fichier_url?: string | null
          id?: string
          norme?: string | null
          numero?: string
          produit?: string
          signature_url?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificats_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificats_emis_par_fkey"
            columns: ["emis_par"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_accounts: {
        Row: {
          email: string
          id: string
          role: string
        }
        Insert: {
          email: string
          id?: string
          role: string
        }
        Update: {
          email?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          commentaires: Json | null
          date_upload: string | null
          date_validation: string | null
          dossier_id: string | null
          est_conforme: boolean | null
          id: string
          metadata: Json | null
          nom: string
          statut: string | null
          statut_validation: string | null
          taille: number | null
          type: string
          uploaded_by: string | null
          url: string
          validateur: string | null
        }
        Insert: {
          commentaires?: Json | null
          date_upload?: string | null
          date_validation?: string | null
          dossier_id?: string | null
          est_conforme?: boolean | null
          id?: string
          metadata?: Json | null
          nom: string
          statut?: string | null
          statut_validation?: string | null
          taille?: number | null
          type: string
          uploaded_by?: string | null
          url: string
          validateur?: string | null
        }
        Update: {
          commentaires?: Json | null
          date_upload?: string | null
          date_validation?: string | null
          dossier_id?: string | null
          est_conforme?: boolean | null
          id?: string
          metadata?: Json | null
          nom?: string
          statut?: string | null
          statut_validation?: string | null
          taille?: number | null
          type?: string
          uploaded_by?: string | null
          url?: string
          validateur?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_validateur_fkey"
            columns: ["validateur"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dossiers: {
        Row: {
          created_by: string | null
          date_certification: string | null
          date_reception: string | null
          description: string | null
          duree_certification: number | null
          historique: Json | null
          id: string
          niveau_conformite: string | null
          operateur_email: string | null
          operateur_nom: string
          operateur_telephone: string | null
          pilote_technique: string | null
          probleme_recurrent: string | null
          produit: string
          produit_code: string | null
          reference: string
          responsable: string | null
          status: string
        }
        Insert: {
          created_by?: string | null
          date_certification?: string | null
          date_reception?: string | null
          description?: string | null
          duree_certification?: number | null
          historique?: Json | null
          id?: string
          niveau_conformite?: string | null
          operateur_email?: string | null
          operateur_nom: string
          operateur_telephone?: string | null
          pilote_technique?: string | null
          probleme_recurrent?: string | null
          produit: string
          produit_code?: string | null
          reference: string
          responsable?: string | null
          status?: string
        }
        Update: {
          created_by?: string | null
          date_certification?: string | null
          date_reception?: string | null
          description?: string | null
          duree_certification?: number | null
          historique?: Json | null
          id?: string
          niveau_conformite?: string | null
          operateur_email?: string | null
          operateur_nom?: string
          operateur_telephone?: string | null
          pilote_technique?: string | null
          probleme_recurrent?: string | null
          produit?: string
          produit_code?: string | null
          reference?: string
          responsable?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "dossiers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dossiers_pilote_technique_fkey"
            columns: ["pilote_technique"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dossiers_responsable_fkey"
            columns: ["responsable"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          commentaires: string | null
          date_creation: string | null
          date_inspection: string
          dossier_id: string | null
          id: string
          inspecteurs: string[] | null
          objectifs: string | null
          points_controle: string[] | null
          rapport_url: string | null
          responsable: string | null
          resultat: string | null
          status: string
        }
        Insert: {
          commentaires?: string | null
          date_creation?: string | null
          date_inspection: string
          dossier_id?: string | null
          id?: string
          inspecteurs?: string[] | null
          objectifs?: string | null
          points_controle?: string[] | null
          rapport_url?: string | null
          responsable?: string | null
          resultat?: string | null
          status?: string
        }
        Update: {
          commentaires?: string | null
          date_creation?: string | null
          date_inspection?: string
          dossier_id?: string | null
          id?: string
          inspecteurs?: string[] | null
          objectifs?: string | null
          points_controle?: string[] | null
          rapport_url?: string | null
          responsable?: string | null
          resultat?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspections_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_responsable_fkey"
            columns: ["responsable"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notes_frais: {
        Row: {
          acquitte: boolean | null
          commentaire: string | null
          date: string | null
          date_creation: string | null
          description: string | null
          dossier_id: string | null
          fichier_url: string | null
          frais_analyses: number | null
          frais_gestion: number | null
          frais_inspection: number | null
          frais_surveillance: number | null
          id: string
          inspecteur_id: string | null
          montant: number
          notification_envoyee: boolean | null
          operateur_notifie: boolean | null
          parametres_analyse: string[] | null
          status: string
        }
        Insert: {
          acquitte?: boolean | null
          commentaire?: string | null
          date?: string | null
          date_creation?: string | null
          description?: string | null
          dossier_id?: string | null
          fichier_url?: string | null
          frais_analyses?: number | null
          frais_gestion?: number | null
          frais_inspection?: number | null
          frais_surveillance?: number | null
          id?: string
          inspecteur_id?: string | null
          montant: number
          notification_envoyee?: boolean | null
          operateur_notifie?: boolean | null
          parametres_analyse?: string[] | null
          status?: string
        }
        Update: {
          acquitte?: boolean | null
          commentaire?: string | null
          date?: string | null
          date_creation?: string | null
          description?: string | null
          dossier_id?: string | null
          fichier_url?: string | null
          frais_analyses?: number | null
          frais_gestion?: number | null
          frais_inspection?: number | null
          frais_surveillance?: number | null
          id?: string
          inspecteur_id?: string | null
          montant?: number
          notification_envoyee?: boolean | null
          operateur_notifie?: boolean | null
          parametres_analyse?: string[] | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_frais_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_frais_inspecteur_id_fkey"
            columns: ["inspecteur_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          date: string | null
          id: string
          lien: string | null
          lue: boolean | null
          message: string
          titre: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          date?: string | null
          id?: string
          lien?: string | null
          lue?: boolean | null
          message: string
          titre: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          date?: string | null
          id?: string
          lien?: string | null
          lue?: boolean | null
          message?: string
          titre?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_actions: {
        Row: {
          action: string
          date: string | null
          details: string | null
          id: string
          module: string | null
          user_id: string
        }
        Insert: {
          action: string
          date?: string | null
          details?: string | null
          id?: string
          module?: string | null
          user_id: string
        }
        Update: {
          action?: string
          date?: string | null
          details?: string | null
          id?: string
          module?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          actions: Json | null
          date_creation: string | null
          email: string
          id: string
          modules: string[] | null
          name: string | null
          permissions: string[] | null
          phone: string | null
          producteur_dossier_id: string | null
          role: string
        }
        Insert: {
          actions?: Json | null
          date_creation?: string | null
          email: string
          id: string
          modules?: string[] | null
          name?: string | null
          permissions?: string[] | null
          phone?: string | null
          producteur_dossier_id?: string | null
          role: string
        }
        Update: {
          actions?: Json | null
          date_creation?: string | null
          email?: string
          id?: string
          modules?: string[] | null
          name?: string | null
          permissions?: string[] | null
          phone?: string | null
          producteur_dossier_id?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
