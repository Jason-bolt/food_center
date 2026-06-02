import {
  Document,
  Font,
  Image,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { Download } from "lucide-react";

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
}

// ─── Markdown parser ────────────────────────────────────────────────────────────
// Extracts structured sections from the consistent Gemini output format.

const parseSections = (markdown: string): RecipeSection => {
  const get = (label: string) =>
    markdown.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*([^\\n]+)`))?.[1]?.trim() ?? "";

  const stepsRaw = markdown.match(/\*\*Steps:\*\*\n([\s\S]+)$/)?.[1] ?? "";
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

Font.register({
  family: "Helvetica",
  fonts: [],
});

const C = {
  orange: "#f97316",
  orangeLight: "#fff7ed",
  orangeBorder: "#fed7aa",
  gray900: "#111827",
  gray700: "#374151",
  gray500: "#6b7280",
  gray100: "#f3f4f6",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: C.white,
    paddingVertical: 48,
    paddingHorizontal: 52,
    fontFamily: "Helvetica",
  },
  // Header bar
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.orangeBorder,
  },
  appName: {
    fontSize: 10,
    color: C.orange,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  aiLabel: {
    fontSize: 9,
    color: C.gray500,
    fontFamily: "Helvetica",
  },
  // Hero image
  heroImage: {
    width: "100%",
    height: 220,
    objectFit: "cover",
    borderRadius: 12,
    marginBottom: 20,
  },
  // Title block
  titleBlock: {
    marginBottom: 20,
  },
  recipeName: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: C.gray900,
    lineHeight: 1.2,
  },
  recipeRegion: {
    fontSize: 12,
    color: C.orange,
    fontFamily: "Helvetica",
    marginTop: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: C.orangeBorder,
    marginBottom: 16,
  },
  // Description
  descriptionBox: {
    backgroundColor: C.orangeLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
  },
  descriptionText: {
    fontSize: 11,
    color: C.gray700,
    fontFamily: "Helvetica-Oblique",
    lineHeight: 1.6,
  },
  // Section label
  sectionLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.orange,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  // Ingredient chips row
  ingredientRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 18,
  },
  chip: {
    backgroundColor: C.gray100,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 10,
    color: C.gray700,
    fontFamily: "Helvetica",
  },
  // Steps
  stepsContainer: {
    marginBottom: 24,
  },
  stepRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.orange,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 9,
    color: C.white,
    fontFamily: "Helvetica-Bold",
  },
  stepText: {
    fontSize: 11,
    color: C.gray700,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
    flex: 1,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 28,
    left: 52,
    right: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: C.gray500,
  },
  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.orange,
  },
});

// ─── PDF Document ───────────────────────────────────────────────────────────────

const RecipeDocument = ({ title, region, imageUrl, markdown }: RecipePDFProps) => {
  const { description, ingredientsUsed, pantryStaples, steps } = parseSections(markdown);

  const allIngredients = [
    ...ingredientsUsed.split(",").map((s) => s.trim()),
    ...pantryStaples.split(",").map((s) => s.trim()),
  ].filter(Boolean);

  return (
    <Document title={title} author="Food Center AI Chef">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerBar}>
          <Text style={styles.appName}>Food Center</Text>
          <Text style={styles.aiLabel}>Generated by AI Chef</Text>
        </View>

        {/* Hero image */}
        {imageUrl && (
          <Image src={imageUrl} style={styles.heroImage} />
        )}

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.recipeName}>{title}</Text>
          {region && <Text style={styles.recipeRegion}>{region} Cuisine</Text>}
        </View>

        <View style={styles.divider} />

        {/* Description */}
        {description && (
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>
        )}

        {/* Ingredients */}
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

        {/* Steps */}
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

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>food-center.app • AI Chef</Text>
          <View style={styles.footerDot} />
          <Text style={styles.footerText}>{title}</Text>
        </View>
      </Page>
    </Document>
  );
};

// ─── Download button ────────────────────────────────────────────────────────────

const RecipePDFDownload = ({ title, region, imageUrl, markdown }: RecipePDFProps) => (
  <PDFDownloadLink
    document={
      <RecipeDocument
        title={title}
        region={region}
        imageUrl={imageUrl}
        markdown={markdown}
      />
    }
    fileName={`${title.toLowerCase().replace(/\s+/g, "-")}-recipe.pdf`}
  >
    {({ loading }) => (
      <button
        disabled={loading}
        className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:cursor-pointer hover:bg-orange-100 disabled:opacity-50 disabled:cursor-wait"
      >
        <Download size={15} />
        {loading ? "Preparing PDF…" : "Download PDF"}
      </button>
    )}
  </PDFDownloadLink>
);

export default RecipePDFDownload;
