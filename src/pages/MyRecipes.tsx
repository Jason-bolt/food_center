import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  BookmarkX,
  FolderOpen,
  FolderPlus,
  Pencil,
  Trash2,
  X,
  Check,
  ChevronRight,
  Sparkles,
  ImageIcon,
  BookOpen,
} from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import {
  getSavedRecipes,
  getCollections,
  createCollection,
  renameCollection,
  deleteCollection,
  deleteRecipe,
  moveRecipeToCollection,
} from "../utils/helpers/apiCalls";

interface Collection {
  _id: string;
  name: string;
}

interface SavedRecipe {
  _id: string;
  title: string;
  region: string;
  markdown: string;
  imageUrl: string | null;
  collectionId: string | null;
  createdAt: string;
}

type FilterMode = "all" | "none" | string; // string = collectionId

const MarkdownComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  h2: ({ children }) => (
    <h2 className="mb-2 mt-0 text-base font-black text-gray-900 border-b border-orange-100 pb-1">{children}</h2>
  ),
  strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
  p: ({ children }) => <p className="my-1.5 leading-relaxed">{children}</p>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  hr: () => null,
};

const MyRecipes = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  // Collection editing state
  const [newCollectionName, setNewCollectionName] = useState("");
  const [creatingCollection, setCreatingCollection] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  // Recipe view modal
  const [viewingRecipe, setViewingRecipe] = useState<SavedRecipe | null>(null);

  // Move recipe dropdown
  const [movingRecipeId, setMovingRecipeId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      navigate("/login", { state: { from: "/my-recipes" } });
    }
  }, [user, token, navigate]);

  useEffect(() => {
    if (!token) return;
    getCollections(token).then(setCollections).catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!token) return;
    setLoadingRecipes(true);
    const collectionId = filter === "all" ? undefined : filter;
    getSavedRecipes(token, collectionId)
      .then(setRecipes)
      .catch(() => {})
      .finally(() => setLoadingRecipes(false));
  }, [token, filter]);

  const refreshRecipes = () => {
    if (!token) return;
    const collectionId = filter === "all" ? undefined : filter;
    getSavedRecipes(token, collectionId).then(setRecipes).catch(() => {});
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim() || !token) return;
    const col = await createCollection(token, newCollectionName.trim());
    setCollections((prev) => [col, ...prev]);
    setNewCollectionName("");
    setCreatingCollection(false);
  };

  const handleRename = async (id: string) => {
    if (!editingName.trim() || !token) return;
    const updated = await renameCollection(token, id, editingName.trim());
    setCollections((prev) => prev.map((c) => (c._id === id ? updated : c)));
    setEditingId(null);
  };

  const handleDeleteCollection = async (id: string) => {
    if (!token) return;
    if (!confirm("Delete this collection? Recipes inside will become uncategorized.")) return;
    await deleteCollection(token, id);
    setCollections((prev) => prev.filter((c) => c._id !== id));
    if (filter === id) setFilter("all");
    refreshRecipes();
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!token) return;
    await deleteRecipe(token, id);
    setRecipes((prev) => prev.filter((r) => r._id !== id));
  };

  const handleMove = async (recipeId: string, collectionId: string | null) => {
    if (!token) return;
    await moveRecipeToCollection(token, recipeId, collectionId);
    setMovingRecipeId(null);
    refreshRecipes();
  };

  const filterLabel = () => {
    if (filter === "all") return "All Recipes";
    if (filter === "none") return "Uncategorized";
    return collections.find((c) => c._id === filter)?.name ?? "Collection";
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      {/* ── Sidebar ── */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-100 bg-gray-50 px-4 py-8 md:block">
        <h2 className="mb-6 px-2 text-xs font-bold uppercase tracking-widest text-gray-400">My Collections</h2>

        <nav className="space-y-1">
          {/* All */}
          <SidebarItem
            label="All Recipes"
            count={null}
            active={filter === "all"}
            onClick={() => setFilter("all")}
            icon={<BookOpen size={15} />}
          />
          {/* Uncategorized */}
          <SidebarItem
            label="Uncategorized"
            count={null}
            active={filter === "none"}
            onClick={() => setFilter("none")}
            icon={<FolderOpen size={15} className="text-gray-400" />}
          />

          {collections.map((col) =>
            editingId === col._id ? (
              <div key={col._id} className="flex items-center gap-1 rounded-xl px-2 py-1.5">
                <input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename(col._id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="flex-1 rounded-lg border border-orange-300 bg-white px-2 py-1 text-xs focus:outline-none"
                />
                <button onClick={() => handleRename(col._id)} className="text-green-500 hover:cursor-pointer"><Check size={13} /></button>
                <button onClick={() => setEditingId(null)} className="text-gray-400 hover:cursor-pointer"><X size={13} /></button>
              </div>
            ) : (
              <div key={col._id} className="group flex items-center gap-1">
                <SidebarItem
                  label={col.name}
                  count={null}
                  active={filter === col._id}
                  onClick={() => setFilter(col._id)}
                  icon={<FolderOpen size={15} className="text-orange-300" />}
                  className="flex-1"
                />
                <button
                  onClick={() => { setEditingId(col._id); setEditingName(col.name); }}
                  className="hidden rounded p-1 text-gray-400 hover:cursor-pointer hover:text-gray-600 group-hover:block"
                >
                  <Pencil size={11} />
                </button>
                <button
                  onClick={() => handleDeleteCollection(col._id)}
                  className="hidden rounded p-1 text-gray-400 hover:cursor-pointer hover:text-red-500 group-hover:block"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ),
          )}
        </nav>

        {/* New collection */}
        <div className="mt-4">
          {creatingCollection ? (
            <div className="flex gap-1.5">
              <input
                autoFocus
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateCollection();
                  if (e.key === "Escape") setCreatingCollection(false);
                }}
                placeholder="Collection name…"
                className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:border-orange-400 focus:outline-none"
              />
              <button
                onClick={handleCreateCollection}
                className="rounded-xl bg-orange-400 px-2.5 text-xs font-bold text-white hover:cursor-pointer hover:bg-orange-500"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCreatingCollection(true)}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-orange-500 transition hover:cursor-pointer hover:bg-orange-50"
            >
              <FolderPlus size={14} /> New Collection
            </button>
          )}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 px-4 py-6 md:px-8 md:py-8">

        {/* Mobile collection chip strip — only visible below md */}
        <div className="mb-5 md:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <CollectionChip label="All" active={filter === "all"} onClick={() => setFilter("all")} />
            <CollectionChip label="Uncategorized" active={filter === "none"} onClick={() => setFilter("none")} />
            {collections.map((col) => (
              <CollectionChip key={col._id} label={col.name} active={filter === col._id} onClick={() => setFilter(col._id)} />
            ))}
            <button
              onClick={() => setCreatingCollection(true)}
              className="shrink-0 rounded-full border border-dashed border-orange-300 px-3 py-1.5 text-xs font-semibold text-orange-500 hover:cursor-pointer hover:bg-orange-50"
            >
              + New
            </button>
          </div>
          {creatingCollection && (
            <div className="mt-3 flex gap-2">
              <input
                autoFocus
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateCollection();
                  if (e.key === "Escape") setCreatingCollection(false);
                }}
                placeholder="Collection name…"
                className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
              />
              <button onClick={handleCreateCollection} className="rounded-xl bg-orange-400 px-3 py-2 text-sm font-bold text-white hover:cursor-pointer hover:bg-orange-500">
                Add
              </button>
              <button onClick={() => setCreatingCollection(false)} className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-500 hover:cursor-pointer">
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">{filterLabel()}</h1>
            <p className="mt-0.5 text-sm text-gray-400">{recipes.length} recipe{recipes.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => navigate("/ai")}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:cursor-pointer hover:from-orange-500 hover:to-orange-600"
          >
            <Sparkles size={15} /> AI Chef
          </button>
        </div>

        {loadingRecipes ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-3xl bg-gray-100" />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <EmptyState onGoToAI={() => navigate("/ai")} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                collections={collections}
                movingId={movingRecipeId}
                onView={() => setViewingRecipe(recipe)}
                onDelete={() => handleDeleteRecipe(recipe._id)}
                onMoveOpen={() => setMovingRecipeId(movingRecipeId === recipe._id ? null : recipe._id)}
                onMove={(collectionId) => handleMove(recipe._id, collectionId)}
                onMoveClose={() => setMovingRecipeId(null)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Recipe View Modal ── */}
      {viewingRecipe && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-12">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewingRecipe(null)} />
          <div className="relative w-full max-w-2xl rounded-3xl border border-gray-100 bg-white shadow-2xl overflow-hidden">
            {viewingRecipe.imageUrl ? (
              <img src={viewingRecipe.imageUrl} alt={viewingRecipe.title} className="aspect-[16/7] w-full object-cover" />
            ) : null}
            <button
              onClick={() => setViewingRecipe(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-600 shadow hover:cursor-pointer hover:bg-white"
            >
              <X size={16} />
            </button>
            <div className="p-6 text-sm text-gray-700">
              <ReactMarkdown components={MarkdownComponents}>{viewingRecipe.markdown}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Sub-components ─────────────────────────────────────────────────────────────

const CollectionChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition hover:cursor-pointer ${
      active ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {label}
  </button>
);

const SidebarItem = ({
  label, active, onClick, icon, className = "",
}: {
  label: string;
  count: number | null;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition hover:cursor-pointer ${
      active ? "bg-orange-50 font-semibold text-orange-600" : "text-gray-600 hover:bg-gray-100"
    } ${className}`}
  >
    {icon}
    <span className="truncate">{label}</span>
    {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
  </button>
);

const RecipeCard = ({
  recipe, collections, movingId, onView, onDelete, onMoveOpen, onMove, onMoveClose,
}: {
  recipe: SavedRecipe;
  collections: Collection[];
  movingId: string | null;
  onView: () => void;
  onDelete: () => void;
  onMoveOpen: () => void;
  onMove: (collectionId: string | null) => void;
  onMoveClose: () => void;
}) => (
  <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
    {/* Image */}
    <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
      {recipe.imageUrl ? (
        <img src={recipe.imageUrl} alt={recipe.title} className="h-full w-full object-cover transition group-hover:scale-105" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ImageIcon size={32} className="text-gray-300" />
        </div>
      )}
    </div>

    {/* Content */}
    <div className="flex flex-1 flex-col p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold leading-snug text-gray-900 line-clamp-2">{recipe.title}</h3>
        {recipe.region && (
          <span className="shrink-0 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
            {recipe.region}
          </span>
        )}
      </div>
      <p className="mb-4 text-xs text-gray-400">
        Saved {new Date(recipe.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>

      <div className="mt-auto flex items-center gap-2">
        <button
          onClick={onView}
          className="flex-1 rounded-xl border border-gray-100 bg-gray-50 py-2 text-xs font-semibold text-gray-700 transition hover:cursor-pointer hover:bg-gray-100"
        >
          View Recipe
        </button>

        {/* Move to collection */}
        <div className="relative">
          <button
            onClick={onMoveOpen}
            title="Move to collection"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-500 transition hover:cursor-pointer hover:bg-gray-100"
          >
            <FolderOpen size={14} />
          </button>
          {movingId === recipe._id && (
            <>
              <div className="fixed inset-0 z-10" onClick={onMoveClose} />
              <div className="absolute bottom-10 right-0 z-20 w-48 rounded-2xl border border-gray-100 bg-white py-1.5 shadow-xl">
                <p className="px-3 pb-1 pt-0.5 text-xs font-bold uppercase tracking-wide text-gray-400">Move to</p>
                <button onClick={() => onMove(null)} className="w-full px-3 py-2 text-left text-xs hover:cursor-pointer hover:bg-gray-50">
                  Uncategorized
                </button>
                {collections.map((col) => (
                  <button key={col._id} onClick={() => onMove(col._id)} className="w-full px-3 py-2 text-left text-xs hover:cursor-pointer hover:bg-gray-50">
                    {col.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={onDelete}
          title="Delete recipe"
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-500 transition hover:cursor-pointer hover:bg-red-50 hover:text-red-500 hover:border-red-100"
        >
          <BookmarkX size={14} />
        </button>
      </div>
    </div>
  </div>
);

const EmptyState = ({ onGoToAI }: { onGoToAI: () => void }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
      <Sparkles size={28} className="text-orange-400" />
    </div>
    <h3 className="mb-2 text-lg font-black text-gray-800">No recipes saved yet</h3>
    <p className="mb-6 max-w-xs text-sm text-gray-400">
      Generate recipes with AI Chef and save your favourites here.
    </p>
    <button
      onClick={onGoToAI}
      className="rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-3 text-sm font-bold text-white hover:cursor-pointer hover:from-orange-500 hover:to-orange-600"
    >
      Open AI Chef
    </button>
  </div>
);

export default MyRecipes;
