import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronDown, X, Sparkles, RotateCcw, ImageIcon, Bookmark, BookmarkCheck, UtensilsCrossed } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import type { IFood } from "../types/food";
import { generateRecipeImages, suggestRecipes, getPantry } from "../utils/helpers/apiCalls";
import RecipePDFDownload from "../components/RecipePDF";
import SaveRecipeModal from "../components/SaveRecipeModal";
import { AuthContext } from "../contexts/AuthContext";

const EDGE_POSITIONS = [
  "top-[18%] left-[6%]",
  "top-[18%] right-[6%]",
  "bottom-[18%] left-[6%]",
  "bottom-[18%] right-[6%]",
];

const MAX_INGREDIENTS = 20;

interface RecipeBlock {
  title: string;
  region: string;
  markdown: string;
  imageUrl: string | null;
  imageLoading: boolean;
}

// Parses "## Recipe Name • Region\n..." blocks out of the streamed markdown
const parseRecipeBlocks = (text: string): RecipeBlock[] => {
  const blocks = text.split(/(?=^## )/m).filter((s) => s.trim());
  return blocks.map((block) => {
    const firstLine = block.split("\n")[0];
    const match = firstLine.match(/^## (.+?)(?:\s*•\s*(.+))?$/);
    return {
      title: match?.[1]?.trim() ?? "Recipe",
      region: match?.[2]?.trim() ?? "",
      markdown: block.replace(/\n---\s*$/m, "").trim(),
      imageUrl: null,
      imageLoading: true,
    };
  });
};

const MarkdownComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  h2: ({ children }) => (
    <h2 className="mb-2 mt-0 text-base font-black text-gray-900 border-b border-orange-100 pb-1">
      {children}
    </h2>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-800">{children}</strong>
  ),
  p: ({ children }) => <p className="my-1.5 leading-relaxed">{children}</p>,
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  hr: () => null,
};

// ─── Image skeleton ────────────────────────────────────────────────────────────
const ImageSkeleton = () => (
  <div className="mb-4 flex aspect-[4/3] w-full animate-pulse items-center justify-center rounded-2xl bg-gray-100">
    <ImageIcon size={32} className="text-gray-300" />
  </div>
);

const AIChef = () => {
  const location = useLocation();
  const { user, token, refreshUser } = useContext(AuthContext);

  // Food data for hero
  const [allFoods, setAllFoods] = useState<IFood[]>([]);
  const [centerFoodIndex, setCenterFoodIndex] = useState(0);
  const [edgeFoods, setEdgeFoods] = useState<IFood[]>([]);
  const [heroReady, setHeroReady] = useState(false);

  // Ingredient input — optionally pre-filled from ?ingredients= URL param
  const [inputValue, setInputValue] = useState("");
  const [ingredients, setIngredients] = useState<string[]>(() => {
    const params = new URLSearchParams(window.location.search);
    const pre = params.get("ingredients");
    if (!pre) return [];
    return pre
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, MAX_INGREDIENTS);
  });

  // Streaming + recipes
  const [phase, setPhase] = useState<"idle" | "streaming" | "done">("idle");
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState("");
  const [recipeBlocks, setRecipeBlocks] = useState<RecipeBlock[]>([]);

  // Save recipe modal
  const [savingRecipe, setSavingRecipe] = useState<RecipeBlock | null>(null);
  const [savedTitles, setSavedTitles] = useState<Set<string>>(new Set());

  // Pantry
  const [pantryLoading, setPantryLoading] = useState(false);

  // Refs
  const heroRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const centerFoodRef = useRef<HTMLDivElement>(null);
  const edgeFoodRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const scrollCTARef = useRef<HTMLDivElement>(null);
  const inputSectionRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // ─── Scroll to input when pre-filled from URL ──────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("ingredients") && inputSectionRef.current) {
      setTimeout(() => {
        inputSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 600);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Fetch hero foods ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/foods/all/items/nonpaginated`,
        );
        const data: IFood[] = await res.json();
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setAllFoods(shuffled);
        setEdgeFoods(shuffled.slice(1, 5));
      } finally {
        setHeroReady(true);
      }
    };
    fetchFoods();
  }, []);

  // ─── Hero entrance animation ────────────────────────────────────────────────
  useGSAP(
    () => {
      if (!heroReady) return;

      gsap.set(
        [spotlightRef.current, centerFoodRef.current, headlineRef.current, subtextRef.current, scrollCTARef.current],
        { opacity: 0 },
      );
      gsap.set(centerFoodRef.current, { scale: 0.7, y: 20 });
      gsap.set(edgeFoodRefs.current.filter(Boolean), { opacity: 0, scale: 0.85 });

      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(spotlightRef.current, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" })
        .to(centerFoodRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "back.out(1.6)" }, "-=0.6")
        .to(edgeFoodRefs.current.filter(Boolean), { opacity: 0.28, scale: 1, stagger: 0.13, duration: 0.7, ease: "power1.out" }, "-=0.4")
        .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.3")
        .to(subtextRef.current, { opacity: 1, duration: 0.6 }, "-=0.4")
        .to(scrollCTARef.current, { opacity: 1, duration: 0.5 }, "-=0.2");

      gsap.to(centerFoodRef.current, { y: -18, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.6 });
      gsap.to(spotlightRef.current, { scale: 1.06, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.2 });

      edgeFoodRefs.current.filter(Boolean).forEach((el, i) => {
        gsap.to(el, { opacity: 0.38, duration: 2 + i * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.5 });
      });
    },
    { scope: heroRef, dependencies: [heroReady] },
  );

  // ─── Center food cycle ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!heroReady || allFoods.length === 0) return;
    const interval = setInterval(() => {
      setCenterFoodIndex((prev) => (prev + 1) % allFoods.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroReady, allFoods.length]);

  const isFirstRender = useRef(true);
  useGSAP(
    () => {
      if (isFirstRender.current) { isFirstRender.current = false; return; }
      if (!centerFoodRef.current) return;
      gsap.fromTo(centerFoodRef.current, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" });
    },
    { dependencies: [centerFoodIndex] },
  );

  // ─── Scroll results into view on stream start ───────────────────────────────
  useEffect(() => {
    if (isStreaming && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isStreaming]);

  // ─── Ingredient helpers ─────────────────────────────────────────────────────
  const addIngredient = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || ingredients.length >= MAX_INGREDIENTS) return;
    if (ingredients.some((i) => i.toLowerCase() === trimmed.toLowerCase())) return;
    setIngredients((prev) => [...prev, trimmed]);
    setInputValue("");
  };

  const removeIngredient = (index: number) =>
    setIngredients((prev) => prev.filter((_, i) => i !== index));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && ingredients.length > 0) {
      removeIngredient(ingredients.length - 1);
    }
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (ingredients.length === 0 || isStreaming) return;

    setPhase("streaming");
    setStreamedText("");
    setStreamError("");
    setRecipeBlocks([]);
    setIsStreaming(true);

    let fullText = "";

    try {
      const response = await suggestRecipes(ingredients);
      if (!response.ok || !response.body) throw new Error("Failed to reach the recipe service.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;
          try {
            const parsed = JSON.parse(raw) as { text?: string; error?: string };
            if (parsed.error) setStreamError(parsed.error);
            else if (parsed.text) {
              fullText += parsed.text;
              setStreamedText(fullText);
            }
          } catch { /* malformed chunk — skip */ }
        }
      }
    } catch (err) {
      setStreamError(err instanceof Error ? err.message : "Something went wrong.");
      setIsStreaming(false);
      return;
    }

    // ── Streaming done — parse blocks and fetch images ──────────────────────
    setIsStreaming(false);
    setPhase("done");

    // Refresh user stats so navbar streak/XP badge reflects the new generate event
    if (user) refreshUser();

    const blocks = parseRecipeBlocks(fullText);
    setRecipeBlocks(blocks);

    if (blocks.length === 0) return;

    try {
      const { images } = await generateRecipeImages(
        blocks.map((b) => ({ name: b.title, region: b.region })),
      );

      setRecipeBlocks((prev) =>
        prev.map((block) => {
          const match = images.find((img) => img.name === block.title);
          return { ...block, imageUrl: match?.url ?? null, imageLoading: false };
        }),
      );
    } catch {
      // Images failed — mark all as done loading with no URL
      setRecipeBlocks((prev) =>
        prev.map((block) => ({ ...block, imageLoading: false })),
      );
    }
  };

  const reset = () => {
    setPhase("idle");
    setStreamedText("");
    setStreamError("");
    setRecipeBlocks([]);
    setIngredients([]);
    setInputValue("");
    setSavedTitles(new Set());
  };

  const centerFood = allFoods[centerFoodIndex];

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-950"
      >
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute"
          style={{
            width: "580px", height: "580px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,146,60,0.22) 0%, rgba(251,146,60,0.10) 35%, transparent 70%)",
          }}
        />

        {edgeFoods.map((food, i) => (
          <div
            key={food._id}
            ref={(el) => { edgeFoodRefs.current[i] = el; }}
            className={`absolute ${EDGE_POSITIONS[i]} hidden md:block`}
          >
            <div className="overflow-hidden rounded-full" style={{ width: 110, height: 110 }}>
              <img src={food.imageUrl} alt="" className="h-full w-full object-cover blur-[1.5px]" />
            </div>
          </div>
        ))}

        <div ref={centerFoodRef} className="relative z-10 mb-8 flex flex-col items-center">
          <div
            className="overflow-hidden rounded-full"
            style={{
              width: 220, height: 220,
              boxShadow: "0 0 90px 28px rgba(251,146,60,0.28), 0 0 0 4px rgba(251,146,60,0.35)",
            }}
          >
            {centerFood ? (
              <img src={centerFood.imageUrl} alt={centerFood.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gray-800" />
            )}
          </div>
          {centerFood && (
            <p className="mt-3 text-sm font-semibold tracking-wide text-orange-300">{centerFood.name}</p>
          )}
        </div>

        <h1
          ref={headlineRef}
          className="relative z-10 px-4 text-center text-3xl font-black text-white sm:px-6 sm:text-4xl md:text-6xl"
        >
          What's in your kitchen?
        </h1>
        <p ref={subtextRef} className="relative z-10 mt-4 px-4 text-center text-base text-gray-400 sm:px-6 sm:text-lg">
          Tell me what you have.&nbsp;
          <span className="font-medium text-orange-400">I'll handle the rest.</span>
        </p>

        <div ref={scrollCTARef} className="absolute bottom-10 flex flex-col items-center gap-1">
          <span className="text-xs uppercase tracking-widest text-gray-600">start cooking</span>
          <button
            onClick={() => inputSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
            aria-label="Scroll to ingredient input"
            className="text-gray-600 transition hover:cursor-pointer hover:text-orange-400"
          >
            <ChevronDown size={28} className="animate-bounce" />
          </button>
        </div>
      </section>

      {/* ── INPUT SECTION ──────────────────────────────────────────────────────── */}
      <section ref={inputSectionRef} className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-20">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black text-gray-800">Add your ingredients</h2>
          <p className="mt-1 text-sm text-gray-500">
            Press{" "}
            <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">Enter</kbd> or{" "}
            <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">,</kbd> after each one
          </p>
        </div>

        {/* Use my pantry — only shown to logged-in users */}
        {user && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={async () => {
                if (!token || pantryLoading) return;
                setPantryLoading(true);
                try {
                  const pantry = await getPantry(token);
                  if (!pantry.ingredients.length) return;
                  setIngredients((prev) => {
                    const merged = [...new Set([...prev, ...pantry.ingredients])];
                    return merged.slice(0, MAX_INGREDIENTS);
                  });
                } finally {
                  setPantryLoading(false);
                }
              }}
              disabled={pantryLoading}
              className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:cursor-pointer hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UtensilsCrossed size={15} />
              {pantryLoading ? "Loading pantry…" : "Use my pantry"}
            </button>
          </div>
        )}

        <div
          className="mb-4 min-h-28 w-full cursor-text rounded-2xl border border-gray-200 bg-gray-50 p-4 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100"
          onClick={() => document.getElementById("ai-ingredient-input")?.focus()}
        >
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing, i) => (
              <span key={i} className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-medium text-orange-800">
                {ing}
                <button onClick={() => removeIngredient(i)} aria-label={`Remove ${ing}`} className="ml-0.5 hover:cursor-pointer hover:text-orange-600">
                  <X size={13} />
                </button>
              </span>
            ))}
            {ingredients.length < MAX_INGREDIENTS && (
              <input
                id="ai-ingredient-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => addIngredient(inputValue)}
                placeholder={ingredients.length === 0 ? "e.g. tomatoes, onions, chicken…" : "Add another…"}
                className="min-w-36 flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
            )}
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between text-xs text-gray-400">
          <span>{ingredients.length} / {MAX_INGREDIENTS} ingredients</span>
          {ingredients.length > 0 && (
            <button onClick={() => setIngredients([])} className="transition hover:cursor-pointer hover:text-red-400">
              Clear all
            </button>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={ingredients.length === 0 || isStreaming}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 py-4 text-base font-bold text-white shadow-md transition hover:cursor-pointer hover:from-orange-500 hover:to-orange-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles size={20} />
          {isStreaming ? "Finding recipes…" : "Find My Recipes"}
        </button>
      </section>

      {/* ── RESULTS SECTION ────────────────────────────────────────────────────── */}
      {phase !== "idle" && (
        <section ref={resultsRef} className="mx-auto max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24">
          {/* Ingredient pills recap */}
          <div className="mb-6 flex flex-wrap gap-2">
            {ingredients.map((ing, i) => (
              <span key={i} className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                {ing}
              </span>
            ))}
          </div>

          {streamError ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
              {streamError}
            </div>
          ) : phase === "streaming" ? (
            /* ── Live stream view ── */
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="text-sm text-gray-700">
                <ReactMarkdown components={MarkdownComponents}>{streamedText}</ReactMarkdown>
                {isStreaming && (
                  <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-orange-400 align-middle" />
                )}
              </div>
            </div>
          ) : (
            /* ── Done: block-by-block with images ── */
            <div className="space-y-8">
              {recipeBlocks.map((block, i) => (
                <div key={i} className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                  {/* Image */}
                  {block.imageLoading ? (
                    <ImageSkeleton />
                  ) : block.imageUrl ? (
                    <img
                      src={block.imageUrl}
                      alt={block.title}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    /* Image failed silently — show nothing */
                    null
                  )}

                  {/* Recipe text */}
                  <div className="p-6 text-sm text-gray-700">
                    <ReactMarkdown components={MarkdownComponents}>
                      {block.markdown}
                    </ReactMarkdown>

                    {/* Actions — only when image is resolved */}
                    {!block.imageLoading && (
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4">
                        <RecipePDFDownload
                          title={block.title}
                          region={block.region}
                          imageUrl={block.imageUrl}
                          markdown={block.markdown}
                        />
                        <button
                          onClick={() => {
                            if (!savedTitles.has(block.title)) setSavingRecipe(block);
                          }}
                          className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:cursor-pointer ${
                            savedTitles.has(block.title)
                              ? "border-green-200 bg-green-50 text-green-600"
                              : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                          }`}
                        >
                          {savedTitles.has(block.title) ? (
                            <><BookmarkCheck size={15} /> Saved</>
                          ) : (
                            <><Bookmark size={15} /> Save</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reset */}
          {phase === "done" && !streamError && (
            <button
              onClick={reset}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-300 py-3 text-sm font-semibold text-orange-600 transition hover:cursor-pointer hover:bg-orange-50"
            >
              <RotateCcw size={16} />
              Try different ingredients
            </button>
          )}
        </section>
      )}

      {/* Save Recipe Modal */}
      {savingRecipe && (
        <SaveRecipeModal
          recipe={savingRecipe}
          onClose={() => setSavingRecipe(null)}
          onSaved={() => setSavedTitles((prev) => new Set(prev).add(savingRecipe.title))}
        />
      )}
    </>
  );
};

export default AIChef;
