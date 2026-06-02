import { useContext, useEffect, useState } from "react";
import { X, Bookmark, BookmarkCheck, Plus, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { getCollections, createCollection, saveRecipe } from "../utils/helpers/apiCalls";

interface Collection {
  _id: string;
  name: string;
}

interface SaveRecipeModalProps {
  recipe: {
    title: string;
    region: string;
    markdown: string;
    imageUrl: string | null;
  };
  onClose: () => void;
  onSaved: () => void;
}

const SaveRecipeModal = ({ recipe, onClose, onSaved }: SaveRecipeModalProps) => {
  const { user, token, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showNewInput, setShowNewInput] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    getCollections(token).then(setCollections).catch(() => {});
  }, [token]);

  const handleCreateAndSelect = async () => {
    if (!newCollectionName.trim() || !token) return;
    try {
      const col = await createCollection(token, newCollectionName.trim());
      setCollections((prev) => [col, ...prev]);
      setSelectedCollectionId(col._id);
      setNewCollectionName("");
      setShowNewInput(false);
    } catch {
      setError("Failed to create collection");
    }
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      await saveRecipe(token, {
        title: recipe.title,
        region: recipe.region,
        markdown: recipe.markdown,
        imageUrl: recipe.imageUrl,
        collectionId: selectedCollectionId,
      });
      onSaved();
      onClose();
      refreshUser();
    } catch {
      setError("Failed to save recipe. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Not logged in — prompt to sign in
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-8 shadow-xl text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:cursor-pointer">
            <X size={20} />
          </button>
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
              <Bookmark size={26} className="text-orange-400" />
            </div>
          </div>
          <h3 className="mb-2 text-lg font-black text-gray-900">Save this recipe</h3>
          <p className="mb-6 text-sm text-gray-500">Sign in to save recipes and build your collection.</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/login", { state: { from: "/ai" } })}
              className="flex-1 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 py-3 text-sm font-bold text-white hover:cursor-pointer hover:from-orange-500 hover:to-orange-600"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="flex-1 rounded-xl border border-orange-200 py-3 text-sm font-semibold text-orange-600 hover:cursor-pointer hover:bg-orange-50"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:cursor-pointer">
          <X size={20} />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
            <BookmarkCheck size={20} className="text-orange-400" />
          </div>
          <div>
            <h3 className="font-black text-gray-900">Save recipe</h3>
            <p className="text-xs text-gray-400 truncate max-w-[180px]">{recipe.title}</p>
          </div>
        </div>

        {error && (
          <div className="mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>
        )}

        {/* Collection selector */}
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Save to collection</p>

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {/* Uncategorized option */}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-gray-50">
              <input
                type="radio"
                name="collection"
                checked={selectedCollectionId === null}
                onChange={() => setSelectedCollectionId(null)}
                className="accent-orange-400"
              />
              <FolderOpen size={15} className="text-gray-400" />
              <span className="text-sm text-gray-700">Uncategorized</span>
            </label>

            {collections.map((col) => (
              <label key={col._id} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-gray-50">
                <input
                  type="radio"
                  name="collection"
                  checked={selectedCollectionId === col._id}
                  onChange={() => setSelectedCollectionId(col._id)}
                  className="accent-orange-400"
                />
                <FolderOpen size={15} className="text-orange-300" />
                <span className="text-sm text-gray-700">{col.name}</span>
              </label>
            ))}
          </div>

          {/* New collection */}
          {showNewInput ? (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateAndSelect()}
                placeholder="Collection name…"
                autoFocus
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
              />
              <button
                onClick={handleCreateAndSelect}
                disabled={!newCollectionName.trim()}
                className="rounded-xl bg-orange-400 px-3 py-2 text-sm font-semibold text-white hover:cursor-pointer hover:bg-orange-500 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowNewInput(true)}
              className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:cursor-pointer hover:underline"
            >
              <Plus size={13} /> New collection
            </button>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 py-3 text-sm font-bold text-white transition hover:cursor-pointer hover:from-orange-500 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Recipe"}
        </button>
      </div>
    </div>
  );
};

export default SaveRecipeModal;
