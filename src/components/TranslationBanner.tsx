import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";

/**
 * Diskret banner som vises kun på engelsk-locale når en sides dype innhold
 * fortsatt er på norsk. Signaliserer "vi vet, oversettelse pågår" — bedre
 * enn å late som om EN-versjonen er komplett.
 */
export function TranslationBanner() {
  const locale = useLocale();
  const t = useTranslations("translationBanner");

  if (locale !== "en") return null;

  return (
    <div className="border-l-2 border-accent bg-elevated p-4 mb-8 flex items-start gap-3">
      <Languages className="w-4 h-4 text-accent-dark mt-0.5 shrink-0" />
      <div className="text-sm">
        <div className="font-medium text-ink mb-1">{t("title")}</div>
        <div className="text-muted leading-relaxed">{t("body")}</div>
      </div>
    </div>
  );
}
