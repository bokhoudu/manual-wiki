"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { manuals as seedManuals } from "@/data/manuals";
import { mapManualInput, mapManualRow, mapSuggestionInput } from "@/lib/manualMapper";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import type { ManualRow } from "@/types/supabase";
import type { Manual } from "@/types/manual";
import type { ManualInput, SuggestionInput } from "@/types/manual";

type ManualContextValue = {
  manuals: Manual[];
  loading: boolean;
  error: string | null;
  isFallback: boolean;
  refreshManuals: () => Promise<void>;
  addManual: (manual: ManualInput) => Promise<Manual>;
  createSuggestion: (suggestion: SuggestionInput) => Promise<void>;
};

const ManualContext = createContext<ManualContextValue | null>(null);

export function ManualProvider({ children }: { children: ReactNode }) {
  const [manuals, setManuals] = useState<Manual[]>(seedManuals);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(!isSupabaseConfigured);

  const refreshManuals = useCallback(async () => {
    if (!supabase) {
      setManuals(seedManuals);
      setLoading(false);
      setIsFallback(true);
      setError(null);
      return;
    }

    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("manuals")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setManuals(seedManuals);
      setError("Supabase에서 매뉴얼을 불러오지 못해 샘플 데이터를 표시합니다.");
      setIsFallback(true);
      setLoading(false);
      return;
    }

    const rows = (data ?? []) as ManualRow[];
    setManuals(rows.map(mapManualRow));
    setError(null);
    setIsFallback(false);
    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      manuals,
      loading,
      error,
      isFallback,
      refreshManuals,
      addManual: async (manual: ManualInput) => {
        if (!supabase) {
          throw new Error("Supabase 환경변수가 설정되지 않아 매뉴얼을 저장할 수 없습니다.");
        }

        const { data, error: insertError } = await supabase
          .from("manuals")
          .insert(mapManualInput(manual))
          .select("*")
          .single();

        if (insertError) {
          throw insertError;
        }

        const createdManual = mapManualRow(data as ManualRow);
        setManuals((current) => [createdManual, ...current.filter((item) => item.id !== createdManual.id)]);
        return createdManual;
      },
      createSuggestion: async (suggestion: SuggestionInput) => {
        if (!supabase) {
          throw new Error("Supabase 환경변수가 설정되지 않아 제안을 저장할 수 없습니다.");
        }

        const { error: insertError } = await supabase.from("suggestions").insert(mapSuggestionInput(suggestion));
        if (insertError) {
          throw insertError;
        }
      }
    }),
    [error, isFallback, loading, manuals, refreshManuals]
  );

  useEffect(() => {
    void refreshManuals();
  }, [refreshManuals]);

  return <ManualContext.Provider value={value}>{children}</ManualContext.Provider>;
}

export function useManuals() {
  const context = useContext(ManualContext);
  if (!context) {
    throw new Error("useManuals must be used within ManualProvider");
  }
  return context;
}
