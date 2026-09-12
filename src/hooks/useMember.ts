// src/hooks/useMember.ts

import { useState, useCallback } from "react";
import { memberService } from "../services/member.service";
import type {
  Member,
  CreateMemberPayload,
  UpdateMemberPayload,
  ContactsPayload,
  EducationPayload,
  SkillsPayload,
} from "../types/member.types";

// `memberService` calls go through `api/client.ts`, whose response
// interceptor already unwraps axios errors into a plain
// `{ message, statusCode, error }` object before this ever runs - so `err`
// here never actually has a `.response` (that's already been consumed) and
// isn't an `Error` instance either. The old checks below only recognized
// those two shapes, so every real backend message (a validation error, a
// 404, anything) silently fell through to the generic fallback - which is
// why a specific, actionable error always rendered as just "An unexpected
// error occurred". Checking for a plain `.message` string covers the
// interceptor's shape and both of the previous ones (a raw axios error and
// a native Error both have `.message` too), so this replaces all three.
const extractMessage = (err: unknown): string => {
  if (err && typeof err === "object") {
    const withResponse = err as { response?: { data?: { message?: string } } };
    if (withResponse.response?.data?.message) {
      return withResponse.response.data.message;
    }
    const withMessage = err as { message?: unknown };
    if (typeof withMessage.message === "string" && withMessage.message) {
      return withMessage.message;
    }
  }
  return "An unexpected error occurred";
};

interface UseMemberReturn {
  member: Member | null;
  memberExists: boolean;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMsg: string | null;
  fetchMember: (userId: string) => Promise<void>;
  saveMemberBasic: (
    userId: string,
    payload: CreateMemberPayload | UpdateMemberPayload,
  ) => Promise<boolean>;
  manageContacts: (
    userId: string,
    payload: ContactsPayload,
  ) => Promise<boolean>;
  manageEducation: (
    userId: string,
    payload: EducationPayload,
  ) => Promise<boolean>;
  manageSkills: (userId: string, payload: SkillsPayload) => Promise<boolean>;
  clearMessages: () => void;
}

export const useMember = (): UseMemberReturn => {
  const [member, setMember] = useState<Member | null>(null);
  const [memberExists, setExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccess] = useState<string | null>(null);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const fetchMember = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await memberService.getMember(userId);
      setMember(data);
      setExists(true);
    } catch {
      // 404 means member not created yet — not an error
      setMember(null);
      setExists(false);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Smart POST vs PATCH based on whether member already exists */
  const saveMemberBasic = useCallback(
    async (
      userId: string,
      payload: CreateMemberPayload | UpdateMemberPayload,
    ): Promise<boolean> => {
      setSaving(true);
      setError(null);
      try {
        const updated = memberExists
          ? await memberService.updateMember(
              userId,
              payload as UpdateMemberPayload,
            )
          : await memberService.createMember(
              userId,
              payload as CreateMemberPayload,
            );
        setMember(updated);
        setExists(true);
        setSuccess("Profile saved successfully!");
        return true;
      } catch (err) {
        setError(extractMessage(err));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [memberExists],
  );

  const manageContacts = useCallback(
    async (userId: string, payload: ContactsPayload): Promise<boolean> => {
      setSaving(true);
      setError(null);
      try {
        if (member?.contacts) {
          await memberService.updateContacts(userId, payload);
        } else {
          await memberService.saveContacts(userId, payload);
        }
        setMember((prev) =>
          prev ? { ...prev, contacts: { ...prev.contacts, ...payload } } : prev,
        );
        setSuccess("Contacts updated!");
        return true;
      } catch (err) {
        setError(extractMessage(err));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [member],
  );

  const manageEducation = useCallback(
    async (userId: string, payload: EducationPayload): Promise<boolean> => {
      setSaving(true);
      setError(null);
      try {
        if (member?.education) {
          await memberService.updateEducation(userId, payload);
        } else {
          await memberService.saveEducation(userId, payload);
        }
        setMember((prev) =>
          prev
            ? {
                ...prev,
                education: {
                  degree: payload.degree ?? prev.education?.degree ?? "",
                  institution:
                    payload.institution ?? prev.education?.institution ?? "",
                  description:
                    payload.description ?? prev.education?.description ?? "",
                  imageUrl: prev.education?.imageUrl ?? "",
                },
              }
            : prev,
        );
        setSuccess("Education updated!");
        return true;
      } catch (err) {
        setError(extractMessage(err));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [member],
  );

  const manageSkills = useCallback(
    async (userId: string, payload: SkillsPayload): Promise<boolean> => {
      setSaving(true);
      setError(null);
      try {
        if (member?.skillDetails?.length) {
          await memberService.updateSkills(userId, payload);
        } else {
          await memberService.saveSkills(userId, payload);
        }
        setMember((prev) =>
          prev
            ? {
                ...prev,
                skillDetails: payload.skillDetails,
                skills: payload.skillDetails.flatMap((s) => s.technologies),
              }
            : prev,
        );
        setSuccess("Skills updated!");
        return true;
      } catch (err) {
        setError(extractMessage(err));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [member],
  );

  return {
    member,
    memberExists,
    loading,
    saving,
    error,
    successMsg,
    fetchMember,
    saveMemberBasic,
    manageContacts,
    manageEducation,
    manageSkills,
    clearMessages,
  };
};
