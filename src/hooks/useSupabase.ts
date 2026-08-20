// Typed react-query hooks for the new portfolio tables.
// Each hook falls back to a static dataset if the Supabase request fails,
// so the site never breaks even if the backend is unavailable.
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { personalInfoFallback, type PersonalInfo } from "@/data/personalInfo";
import { projectsFallback, type DbProject } from "@/data/projectsFallback";
import { skillsFallback, type DbSkill } from "@/data/skillsFallback";
import { experienceFallback, type DbExperience } from "@/data/experienceFallback";
import { testimonialsFallback, type DbTestimonial } from "@/data/testimonialsFallback";
import { blogPostsFallback, type DbBlogPost } from "@/data/blogPostsFallback";
import { certificatesFallback, type DbCertificate } from "@/data/certificatesFallback";

/* ---------------- personal_info ---------------- */
export function usePersonalInfo() {
  return useQuery<PersonalInfo>({
    queryKey: ["personal_info"],
    queryFn: async () => {
      const { data, error } = await supabase.from("personal_info").select("key, value");
      if (error) throw error;
      const out: PersonalInfo = { ...personalInfoFallback };
      (data ?? []).forEach((r: { key: string; value: string }) => {
        out[r.key] = r.value;
      });
      return out;
    },
    placeholderData: personalInfoFallback,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

/* ---------------- projects ---------------- */
export function useProjects(category?: DbProject["category"] | "All") {
  return useQuery<DbProject[]>({
    queryKey: ["projects", category ?? "All"],
    queryFn: async () => {
      let q = supabase.from("projects").select("*").order("sort_order", { ascending: true });
      if (category && category !== "All") q = q.eq("category", category);
      const { data, error } = await q;
      if (error) throw error;
      return (data as unknown as DbProject[]) ?? [];
    },
    placeholderData: projectsFallback,
    staleTime: 60_000,
    retry: 1,
  });
}

/* ---------------- skills ---------------- */
export function useSkills() {
  return useQuery<DbSkill[]>({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data as unknown as DbSkill[]) ?? [];
    },
    placeholderData: skillsFallback,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

/* ---------------- experience ---------------- */
export function useExperience(type?: "work" | "education" | "all") {
  return useQuery<DbExperience[]>({
    queryKey: ["experience", type ?? "all"],
    queryFn: async () => {
      let q = supabase.from("experience").select("*").order("sort_order", { ascending: true });
      if (type && type !== "all") q = q.eq("type", type);
      const { data, error } = await q;
      if (error) throw error;
      return (data as unknown as DbExperience[]) ?? [];
    },
    placeholderData: experienceFallback,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

/* ---------------- testimonials ---------------- */
export function useTestimonials() {
  return useQuery<DbTestimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data as unknown as DbTestimonial[]) ?? [];
    },
    placeholderData: testimonialsFallback,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

/* ---------------- blog_posts (external links) ---------------- */
export function useBlogPosts() {
  return useQuery<DbBlogPost[]>({
    queryKey: ["blog_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data as unknown as DbBlogPost[]) ?? [];
    },
    placeholderData: blogPostsFallback,
    staleTime: 60_000,
    retry: 1,
  });
}

/* ---------------- certificates ---------------- */
export function useCertificates() {
  return useQuery<DbCertificate[]>({
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data as unknown as DbCertificate[]) ?? [];
    },
    placeholderData: certificatesFallback,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
