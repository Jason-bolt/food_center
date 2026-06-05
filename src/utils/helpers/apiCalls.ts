/* eslint-disable @typescript-eslint/no-explicit-any */
import { authHeaders } from "../auth";

// ########## FOOD REQUESTS ##########
export const createFoodRequest = async (preparedData: Record<string, any>) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_BASE_URL}/foods`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(preparedData),
    },
  );

  return response;
};

export const updateFoodRequest = async (
  preparedData: Record<string, any>,
  selectedFoodId: string | undefined,
) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_BASE_URL}/foods/${selectedFoodId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(preparedData),
    },
  );

  return response;
};

export const deleteFoodRequest = async (
  selectedFoodId: string | undefined,
) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_BASE_URL}/foods/${selectedFoodId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
    },
  );

  return response;
};

// ########## RECIPE REQUESTS ##########
export const suggestRecipes = async (ingredients: string[], token?: string | null): Promise<Response> => {
  return fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/recipes/suggest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ ingredients }),
  });
};

export const generateRecipeImages = async (
  recipes: { name: string; region: string }[],
): Promise<{ images: { name: string; url: string | null }[] }> => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_BASE_URL}/recipes/images`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipes }),
    },
  );
  if (!response.ok) throw new Error("Failed to generate images");
  return response.json();
};

// ########## SAVED RECIPE REQUESTS ##########

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });
const BASE = import.meta.env.VITE_SERVER_BASE_URL;

export const getSavedRecipes = async (token: string, collectionId?: string): Promise<any[]> => {
  const url = collectionId
    ? `${BASE}/saved-recipes?collectionId=${encodeURIComponent(collectionId)}`
    : `${BASE}/saved-recipes`;
  const res = await fetch(url, { headers: authHeader(token) });
  if (!res.ok) throw new Error("Failed to fetch saved recipes");
  return res.json();
};

export const saveRecipe = async (
  token: string,
  data: { title: string; region: string; markdown: string; imageUrl: string | null; collectionId: string | null },
): Promise<any> => {
  const res = await fetch(`${BASE}/saved-recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save recipe");
  return res.json();
};

export const deleteRecipe = async (token: string, id: string): Promise<void> => {
  const res = await fetch(`${BASE}/saved-recipes/${id}`, {
    method: "DELETE",
    headers: authHeader(token),
  });
  if (!res.ok) throw new Error("Failed to delete recipe");
};

export const moveRecipeToCollection = async (
  token: string,
  id: string,
  collectionId: string | null,
): Promise<any> => {
  const res = await fetch(`${BASE}/saved-recipes/${id}/collection`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify({ collectionId }),
  });
  if (!res.ok) throw new Error("Failed to move recipe");
  return res.json();
};

export const getCollections = async (token: string): Promise<any[]> => {
  const res = await fetch(`${BASE}/saved-recipes/collections`, { headers: authHeader(token) });
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
};

export const createCollection = async (token: string, name: string): Promise<any> => {
  const res = await fetch(`${BASE}/saved-recipes/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create collection");
  return res.json();
};

export const renameCollection = async (token: string, id: string, name: string): Promise<any> => {
  const res = await fetch(`${BASE}/saved-recipes/collections/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to rename collection");
  return res.json();
};

export const deleteCollection = async (token: string, id: string): Promise<void> => {
  const res = await fetch(`${BASE}/saved-recipes/collections/${id}`, {
    method: "DELETE",
    headers: authHeader(token),
  });
  if (!res.ok) throw new Error("Failed to delete collection");
};

// ########## MEAL PLAN REQUESTS ##########

export const getMealPlan = async (token: string, weekStart: string): Promise<any> => {
  const res = await fetch(`${BASE}/meal-plan?weekStart=${encodeURIComponent(weekStart)}`, {
    headers: authHeader(token),
  });
  if (!res.ok) throw new Error("Failed to fetch meal plan");
  return res.json();
};

export const setMealPlanSlot = async (
  token: string,
  data: {
    weekStart: string;
    day: number;
    savedRecipeId?: string | null;
    title: string;
    region: string;
    imageUrl: string | null;
    ingredients: string[];
  },
): Promise<any> => {
  const res = await fetch(`${BASE}/meal-plan/slot`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update meal plan");
  return res.json();
};

export const clearMealPlanSlot = async (
  token: string,
  weekStart: string,
  day: number,
): Promise<any> => {
  const res = await fetch(`${BASE}/meal-plan/slot`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify({ weekStart, day }),
  });
  if (!res.ok) throw new Error("Failed to clear meal plan slot");
  return res.json();
};

// ########## TRENDING REQUESTS ##########

export const getTrending = async (): Promise<{
  week: string;
  ingredients: { name: string; count: number }[];
}> => {
  const res = await fetch(`${BASE}/trending`);
  if (!res.ok) throw new Error("Failed to fetch trending data");
  return res.json();
};

// ########## PANTRY REQUESTS ##########

export const getPantry = async (token: string): Promise<{ ingredients: string[] }> => {
  const res = await fetch(`${BASE}/pantry`, { headers: authHeader(token) });
  if (!res.ok) throw new Error("Failed to fetch pantry");
  return res.json();
};

export const setPantry = async (token: string, ingredients: string[]): Promise<{ ingredients: string[] }> => {
  const res = await fetch(`${BASE}/pantry`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify({ ingredients }),
  });
  if (!res.ok) throw new Error("Failed to update pantry");
  return res.json();
};

export const addPantryIngredient = async (token: string, ingredient: string): Promise<{ ingredients: string[] }> => {
  const res = await fetch(`${BASE}/pantry/ingredient`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify({ ingredient }),
  });
  if (!res.ok) throw new Error("Failed to add ingredient");
  return res.json();
};

export const removePantryIngredient = async (token: string, ingredient: string): Promise<{ ingredients: string[] }> => {
  const res = await fetch(`${BASE}/pantry/ingredient`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify({ ingredient }),
  });
  if (!res.ok) throw new Error("Failed to remove ingredient");
  return res.json();
};

// ########## EDITORIAL REQUESTS ##########

export const getActiveEditorial = async (): Promise<any> => {
  const res = await fetch(`${BASE}/editorials/active`);
  if (!res.ok) throw new Error("Failed to fetch editorial");
  return res.json();
};

export const getAllEditorials = async (): Promise<any[]> => {
  const res = await fetch(`${BASE}/editorials`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch editorials");
  return res.json();
};

export const createEditorial = async (data: Record<string, any>): Promise<any> => {
  const res = await fetch(`${BASE}/editorials`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to create editorial"); }
  return res.json();
};

export const updateEditorial = async (id: string, data: Record<string, any>): Promise<any> => {
  const res = await fetch(`${BASE}/editorials/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? "Failed to update editorial"); }
  return res.json();
};

export const deleteEditorial = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE}/editorials/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete editorial");
};

// ########## BILLING REQUESTS ##########

export const createCheckoutSession = async (token: string): Promise<{ url: string }> => {
  const res = await fetch(`${BASE}/billing/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
  });
  if (!res.ok) throw new Error("Failed to start checkout");
  return res.json();
};

export const authorisePdfDownload = async (token: string): Promise<{ allowed: boolean; creditsUsed: number; creditsRemaining?: number }> => {
  const res = await fetch(`${BASE}/billing/pdf-download`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
  });
  if (res.status === 402) return { allowed: false, creditsUsed: 0 };
  if (!res.ok) throw new Error("Auth check failed");
  return res.json();
};

export const createCreditsCheckout = async (token: string): Promise<{ url: string }> => {
  const res = await fetch(`${BASE}/billing/credits`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
  });
  if (!res.ok) throw new Error("Failed to start credits checkout");
  return res.json();
};

export const createPortalSession = async (token: string): Promise<{ url: string }> => {
  const res = await fetch(`${BASE}/billing/portal`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
  });
  if (!res.ok) throw new Error("Failed to open billing portal");
  return res.json();
};

// ########## GENERAL REQUESTS ##########
export const uploadImageRequest = async (formData: FormData) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_BASE_URL}/upload`,
    {
      method: "POST",
      headers: {
        ...authHeaders(),
      },
      body: formData,
    },
  );

  return response;
};
