export type DbCertificate = {
  id: string;
  title: string;
  issuer: string;
  issuer_logo_url: string | null;
  issue_date: string | null;
  verify_url: string | null;
  source_type: "credly" | "manual" | string;
  sort_order: number;
  is_published: boolean;
};

// No invented credentials — certificates are CMS-managed only.
export const certificatesFallback: DbCertificate[] = [];
