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
