import {
  BlobProvider,
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { Download, Lock } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { authorisePdfDownload } from "../utils/helpers/apiCalls";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface RecipeSection {
  description: string;
  ingredientsUsed: string;
  pantryStaples: string;
  steps: string[];
}

interface RecipePDFProps {
  title: string;
  region: string;
  imageUrl: string | null;
  markdown: string;
  onNeedUpgrade?: () => void; // called when user must upgrade/buy credits
}

// ─── Markdown parser ────────────────────────────────────────────────────────────

const parseSections = (markdown: string): RecipeSection => {
  const get = (label: string) =>
    markdown.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*([^\\n]+)`))?.[1]?.trim() ?? "";

  const stepsRaw = markdown.match(/\*\*Steps:\*\*\n([\s\S]+?)(?=\n\*\*|$)/)?.[1] ?? "";
  const steps = stepsRaw
    .split("\n")
    .filter((l) => /^\d+\./.test(l.trim()))
    .map((l) => l.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);

  return {
    description: get("Description"),
    ingredientsUsed: get("Your ingredients used"),
    pantryStaples: get("Additional pantry staples needed"),
    steps,
  };
};

// ─── Styles ─────────────────────────────────────────────────────────────────────

Font.register({ family: "Helvetica", fonts: [] });

const C = {
  orange: "#f97316",
  orangeLight: "#fff7ed",
  orangeBorder: "#fed7aa",
  gray900: "#111827",
  gray700: "#374151",
  gray500: "#6b7280",
  gray100: "#f3f4f6",
  gray300: "#d1d5db",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: C.white,
    paddingVertical: 48,
    paddingHorizontal: 52,
    fontFamily: "Helvetica",
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.orangeBorder,
  },
  appName: { fontSize: 10, color: C.orange, fontFamily: "Helvetica-Bold", letterSpacing: 1.5, textTransform: "uppercase" },
  aiLabel: { fontSize: 9, color: C.gray500, fontFamily: "Helvetica" },
  heroImage: { width: "100%", height: 220, objectFit: "cover", borderRadius: 12, marginBottom: 20 },
  titleBlock: { marginBottom: 20 },
  recipeName: { fontSize: 26, fontFamily: "Helvetica-Bold", color: C.gray900, lineHeight: 1.2 },
  recipeRegion: { fontSize: 12, color: C.orange, fontFamily: "Helvetica", marginTop: 4 },
  divider: { borderBottomWidth: 1, borderBottomColor: C.orangeBorder, marginBottom: 16 },
  descriptionBox: { backgroundColor: C.orangeLight, borderRadius: 8, padding: 12, marginBottom: 18 },
  descriptionText: { fontSize: 11, color: C.gray700, fontFamily: "Helvetica-Oblique", lineHeight: 1.6 },
  sectionLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: C.orange, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 },
  ingredientRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 18 },
  chip: { backgroundColor: C.gray100, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 10, color: C.gray700, fontFamily: "Helvetica" },
  stepsContainer: { marginBottom: 24 },
  stepRow: { flexDirection: "row", marginBottom: 10, alignItems: "flex-start" },
  stepNumber: { width: 22, height: 22, borderRadius: 11, backgroundColor: C.orange, alignItems: "center", justifyContent: "center", marginRight: 10, flexShrink: 0, marginTop: 1 },
  stepNumberText: { fontSize: 9, color: C.white, fontFamily: "Helvetica-Bold" },
  stepText: { fontSize: 11, color: C.gray700, fontFamily: "Helvetica", lineHeight: 1.6, flex: 1 },
  footer: { position: "absolute", bottom: 28, left: 52, right: 52, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerText: { fontSize: 8, color: C.gray500 },
  footerDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.orange },
  // Watermark banner (non-Pro)
  watermark: {
    position: "absolute", bottom: 44, left: 52, right: 52,
    borderTopWidth: 1, borderTopColor: C.gray300,
    paddingTop: 6,
  },
  watermarkText: { fontSize: 7.5, color: C.gray300, fontFamily: "Helvetica", textAlign: "center", letterSpacing: 0.5 },
});

// ─── PDF Document ───────────────────────────────────────────────────────────────

const RecipeDocument = ({
  title, region, imageUrl, markdown, isPro,
}: RecipePDFProps & { isPro: boolean }) => {
  const { description, ingredientsUsed, pantryStaples, steps } = parseSections(markdown);
  const allIngredients = [
    ...ingredientsUsed.split(",").map((s) => s.trim()),
    ...pantryStaples.split(",").map((s) => s.trim()),
  ].filter(Boolean);

  return (
    <Document title={title} author="Food Center AI Chef">
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBar}>
          <Text style={styles.appName}>Food Center</Text>
          <Text style={styles.aiLabel}>Generated by AI Chef</Text>
        </View>

        {imageUrl && <Image src={imageUrl} style={styles.heroImage} />}

        <View style={styles.titleBlock}>
          <Text style={styles.recipeName}>{title}</Text>
          {region && <Text style={styles.recipeRegion}>{region} Cuisine</Text>}
        </View>

        <View style={styles.divider} />

        {description && (
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>
        )}

        {allIngredients.length > 0 && (
          <View style={{ marginBottom: 18 }}>
            <Text style={styles.sectionLabel}>Ingredients</Text>
            <View style={styles.ingredientRow}>
              {allIngredients.map((ing, i) => (
                <View key={i} style={styles.chip}>
                  <Text style={styles.chipText}>{ing}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {steps.length > 0 && (
          <View style={styles.stepsContainer}>
            <Text style={styles.sectionLabel}>Method</Text>
            {steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Watermark for non-Pro downloads */}
        {!isPro && (
          <View style={styles.watermark} fixed>
            <Text style={styles.watermarkText}>
              Generated by Food Center · Upgrade to Pro for clean, watermark-free downloads
            </Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>food-center.app · AI Chef</Text>
          <View style={styles.footerDot} />
          <Text style={styles.footerText}>{title}</Text>
        </View>
      </Page>
    </Document>
  );
};

// ─── Download button ────────────────────────────────────────────────────────────

const RecipePDFDownload = ({ title, region, imageUrl, markdown, onNeedUpgrade }: RecipePDFProps) => {
  const { user, token, refreshUser } = useContext(AuthContext);
  const [state, setState] = useState<"idle" | "checking" | "ready" | "error">("idle");
  const [isPro, setIsPro] = useState(false);

  const triggerDownload = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-recipe.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setState("idle");
  };

  const handleClick = async () => {
    // Guest
    if (!user || !token) { onNeedUpgrade?.(); return; }

    // Pro — download immediately, no API call needed
    if (user.plan === "pro") { setIsPro(true); setState("ready"); return; }

    // Free user — check credits via API
    setState("checking");
    try {
      const result = await authorisePdfDownload(token);
      if (result.allowed) {
        setIsPro(false);
        setState("ready");
        if (result.creditsUsed > 0) refreshUser(); // update navbar credit chip
      } else {
        setState("idle");
        onNeedUpgrade?.();
      }
    } catch {
      setState("error");
    }
  };

  if (state === "ready") {
    return (
      <BlobProvider document={<RecipeDocument title={title} region={region} imageUrl={imageUrl} markdown={markdown} isPro={isPro} />}>
        {({ url, loading }) => {
          if (!loading && url) triggerDownload(url);
          return (
            <button
              disabled
              className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 opacity-60 cursor-wait"
            >
              <Download size={15} />
              Preparing PDF…
            </button>
          );
        }}
      </BlobProvider>
    );
  }

  // Free user with no account or no credits — show lock
  const isLocked = !user || (user.plan === "free" && (user.credits ?? 0) === 0);

  return (
    <button
      onClick={handleClick}
      disabled={state === "checking"}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:cursor-pointer ${
        isLocked
          ? "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
          : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
      } disabled:opacity-60 disabled:cursor-wait`}
    >
      {isLocked ? <Lock size={15} /> : <Download size={15} />}
      {state === "checking"
        ? "Checking…"
        : state === "error"
          ? "Try again"
          : isLocked
            ? "Download PDF"
            : "Download PDF"}
      {isLocked && (
        <span className="ml-1 rounded-full bg-gray-200 px-1.5 py-0.5 text-xs font-bold text-gray-500">
          {user ? "1cr" : "Pro"}
        </span>
      )}
    </button>
  );
};

export default RecipePDFDownload;
