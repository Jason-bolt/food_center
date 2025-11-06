import { useGSAP } from "@gsap/react";
import FoodCardSection from "../components/FoodCardSection";
import gsap from "gsap";
import apple from "../assets/ingredients/apple-svgrepo-com.svg";
import banana from "../assets/ingredients/banana-svgrepo-com.svg";
import carrot from "../assets/ingredients/carrot-svgrepo-com.svg";
import chicken1 from "../assets/ingredients/chicken-leg-chicken1-svgrepo-com.svg";
import chicken from "../assets/ingredients/chicken-leg-chicken-svgrepo-com.svg";
import corn from "../assets/ingredients/corn-svgrepo-com.svg";
import friedEgg from "../assets/ingredients/fried-egg-svgrepo-com.svg";
import grapes from "../assets/ingredients/grapes-grape-svgrepo-com.svg";
import hamburger from "../assets/ingredients/hamburger-food-svgrepo-com.svg";
import honey from "../assets/ingredients/honey-svgrepo-com.svg";
import lemon from "../assets/ingredients/lemon-svgrepo-com.svg";
import peach from "../assets/ingredients/peach-svgrepo-com.svg";
import pear from "../assets/ingredients/pear-svgrepo-com.svg";
import potato from "../assets/ingredients/potato-svgrepo-com.svg";
import pumpkin from "../assets/ingredients/pumpkin-svgrepo-com.svg";
import roast from "../assets/ingredients/roast-chicken-chicken-svgrepo-com.svg";
import strawberry from "../assets/ingredients/strawberry-svgrepo-com.svg";
import watermelon from "../assets/ingredients/watermelon-diet-svgrepo-com.svg";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HomeIngredientAnimation } from "../types/homeScreen";
import CountryRegionFilter from "../components/CountryRegionFilter";

const Home = () => {
  const ingredients = useMemo(
    () => [
      apple,
      banana,
      carrot,
      chicken,
      chicken1,
      corn,
      friedEgg,
      grapes,
      hamburger,
      honey,
      lemon,
      peach,
      pear,
      potato,
      pumpkin,
      roast,
      strawberry,
      watermelon,
    ],
    [],
  );

  const foods = [
    {
      _id: 1,
      name: "Beans and gari",
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
      country: "Ghana",
      region: "Greater Accra",
      culturalStory:
        "Beans and gari is a beloved comfort food enjoyed across Ghana, often sold by neighborhood vendors in the late afternoon. The creaminess of stewed beans meets the crunchy texture of gari, sometimes topped with ripe plantain and a drizzle of palm oil. It’s a portable, affordable meal that evokes childhood memories and bustling street corners where friends gather for a quick, satisfying bite.",
      ingredients: ["Egg", "Rice", "Beans", "Plantain"],
    },
    {
      _id: 2,
      name: "Salad and tuna",
      imageUrl:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1480",
      country: "Ghana",
      region: "Greater Accra",
      culturalStory:
        "Fresh salad and tuna is a staple of coastal communities, where fishermen return at dawn with the day’s catch. Crisp greens, tomatoes, and onions are tossed with lime and pepper, then crowned with flaky tuna for a balanced, energizing plate. It’s the taste of sea breeze and market mornings, light enough for the midday heat but full of the bold flavors Ghanaians love.",
      ingredients: ["Egg", "Rice", "Beans", "Plantain"],
    },
    {
      _id: 3,
      name: "Pizza",
      imageUrl:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1081",
      country: "Ghana",
      region: "Greater Accra",
      culturalStory:
        "Pizza has found a playful home in Ghana’s urban food scene, adapted with local toppings like suya-spiced chicken and shito drizzles. Street vendors experiment with wood-fired flavors while cafes serve thin, crispy bases with bright, tangy sauces. It’s a snapshot of modern Ghana—rooted in tradition yet open to new influences, shared among friends late into the night.",
      ingredients: ["Egg", "Rice", "Beans", "Plantain"],
    },
    {
      _id: 4,
      name: "Jollof rice and chicken",
      imageUrl:
        "https://images.unsplash.com/photo-1664992960082-0ea299a9c53e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
      country: "Ghana",
      region: "Ashanti",
      culturalStory:
        "Jollof rice and chicken is the heartbeat of weekend gatherings and festive celebrations, simmered low with tomatoes, onions, and spices until each grain is richly colored. The sizzling chicken—marinated with ginger and pepper—adds smoky depth. Debates over who makes the best jollof are spirited and joyful, a friendly rivalry that brings communities together.",
      ingredients: ["Rice", "Tomato", "Onion", "Chicken", "Pepper"],
    },
    {
      _id: 5,
      name: "Waakye with gari",
      imageUrl:
        "https://images.unsplash.com/photo-1721314678207-8b7bd43e677b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1035",
      country: "Ghana",
      region: "Northern",
      culturalStory:
        "Waakye with gari is a morning ritual, served from big aluminum pots lined with banana leaves at busy junctions. Smoky rice-and-beans are paired with shito, spaghetti, salad, and a sprinkle of gari for texture. It’s a choose-your-own-adventure plate that fuels workers and students alike as the city wakes.",
      ingredients: ["Rice", "Black-eyed peas", "Gari", "Spaghetti", "Egg"],
    },
    {
      _id: 6,
      name: "Kelewele",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1663854478810-26b620ade38a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
      country: "Ghana",
      region: "Greater Accra",
      culturalStory:
        "Kelewele is the glow of night-time Accra—plantains kissed by ginger, chili, and cloves, sizzling in oil until caramelized at the edges. The aroma draws crowds to street stalls where laughter accompanies the rhythmic clatter of pans. Sweet, spicy, and a little smoky, it’s a simple pleasure that never grows old.",
      ingredients: ["Plantain", "Ginger", "Clove", "Pepper", "Salt"],
    },
    {
      _id: 7,
      name: "Banku and tilapia",
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1400",
      country: "Ghana",
      region: "Volta",
      culturalStory:
        "Banku and tilapia brings the coast to the table: fermented corn-and-cassava dough gently kneaded into smooth, tangy balls, served with charred tilapia fresh off the grill. A fiery pepper sauce and sliced onions add brightness. It’s best eaten with hands, shared among family on a breezy evening.",
      ingredients: [
        "Corn dough",
        "Cassava dough",
        "Tilapia",
        "Pepper",
        "Onion",
      ],
    },
    {
      _id: 8,
      name: "Fufu and light soup",
      imageUrl:
        "https://images.unsplash.com/photo-1543353071-10c8ba85a904?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
      country: "Ghana",
      region: "Brong Ahafo",
      culturalStory:
        "Fufu and light soup is Sunday comfort—cassava and plantain pounded to a soft, stretchy texture, then nestled in a fragrant broth. Tomatoes, garden eggs, and pepper give the soup warmth without heaviness. It’s a meal that invites lingering conversations and second helpings.",
      ingredients: ["Cassava", "Plantain", "Tomato", "Pepper", "Goat"],
    },
    {
      _id: 9,
      name: "Shito fried rice",
      imageUrl:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2072",
      country: "Ghana",
      region: "Central",
      culturalStory:
        "Shito fried rice blends the deep umami of black pepper sauce with the smoky breath of the wok. Bits of egg and vegetables add color while the shito perfumes every bite with heat and savoriness. It’s a modern street-food classic, unapologetically bold and irresistibly moreish.",
      ingredients: ["Rice", "Shito", "Egg", "Carrot", "Peas"],
    },
    {
      _id: 10,
      name: "Kokonte and groundnut soup",
      imageUrl:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
      country: "Ghana",
      region: "Eastern",
      culturalStory:
        "Kokonte and groundnut soup is a quietly cherished staple—earthy, nourishing, and steeped in memory. The dried cassava base has a gentle aroma, while the peanut-rich soup brings velvet depth, sometimes enriched with fish or goat. It’s the kind of meal that restores you after a long day.",
      ingredients: ["Kokonte", "Groundnut", "Tomato", "Pepper", "Fish"],
    },
  ];
  const foodCardSectionRef = useRef<HTMLDivElement>(null);
  const [droppingIngredients, setDroppingIngredients] =
    useState<HomeIngredientAnimation[]>();

  const brandName = useRef<HTMLHeadingElement>(null);
  const initialAnimationContainer = useRef<HTMLElement>(null);

  useEffect(() => {
    const fruitDroppings: HomeIngredientAnimation[] = [];
    for (let i = 0; i < ingredients.length; i++) {
      fruitDroppings.push({
        id: i,
        image: ingredients[i],
        x: Math.random() * 100, // Random horizontal position (0-100%)
        delay: Math.random() * 3, // Random delay (0-3 seconds)
        duration: 2 + Math.random() * 3, // Random duration (2-5 seconds)
      });
    }

    setDroppingIngredients(fruitDroppings);
  }, [ingredients]);

  useGSAP(
    () => {
      gsap.set(".countryRegionFilter", {
        autoAlpha: 0,
      });
      // Brand name animation
      const brandTl = gsap.timeline();
      brandTl
        .fromTo(
          brandName.current,
          {
            autoAlpha: 0,
            scale: 0,
          },
          {
            y: -90,
            delay: 1,
            autoAlpha: 1,
            duration: 1,
            ease: "bounce",
            scale: 1,
          },
        )
        .to(brandName.current, {
          delay: 1,
          rotation: 5,
          scale: 1.2,
          yoyo: true,
          repeat: 1,
          duration: 0.2,
        })
        .to(brandName.current, {
          delay: 1,
          duration: 1,
          ease: "power1",
          autoAlpha: 0,
        })
        .to(".countryRegionFilter", {
          autoAlpha: 1,
        });

      // Dropping ingredients animation
      droppingIngredients?.forEach((fruit) => {
        const dropElement = document.getElementById(`fruit-${fruit.id}`);
        if (dropElement) {
          gsap.fromTo(
            dropElement,
            {
              y: -100,
              opacity: 0,
            },
            {
              y: "100vh",
              opacity: 1,
              duration: fruit.duration,
              delay: fruit.delay,
              ease: "power2.out",
              onComplete: () => {
                gsap.to(dropElement, {
                  autoAlpha: 0,
                  duration: 0.8,
                  ease: "power1.out",
                });
              },
            },
          );
        }
      });
    },
    { dependencies: [droppingIngredients], scope: initialAnimationContainer },
  );

  useGSAP(() => {
    gsap.from(foodCardSectionRef.current, {
      autoAlpha: 0,
      y: 50,
      duration: 1,
      delay: 5,
    });
  }, {});

  return (
    <section className="min-h-screen pt-2" ref={initialAnimationContainer}>
      <CountryRegionFilter className="countryRegionFilter" />
      <section className="fixed inset-0 mt-30">
        <div className="relative flex h-screen w-screen items-center justify-center gap-3 overflow-hidden">
          {droppingIngredients?.map((fruit) => (
            <img
              key={fruit.id}
              id={`fruit-${fruit.id}`}
              className="absolute"
              src={fruit.image}
              alt={fruit.image}
              style={{
                left: `${fruit.x}%`,
                top: -50,
              }}
              height={50}
              width={50}
            />
          ))}
          <h1
            className="z-10 mx-auto text-center text-5xl font-black uppercase lg:text-7xl"
            ref={brandName}
          >
            <span className="text-red-500">FO</span>
            <span className="text-orange-500">OD</span>
            <span className="text-yellow-500"> C</span>
            <span className="text-green-500">EN</span>
            <span className="text-blue-500">TE</span>
            <span className="text-purple-500">R</span>
          </h1>
        </div>
        C
      </section>
      <div ref={foodCardSectionRef}>
        <FoodCardSection foods={foods} />
      </div>
    </section>
  );
};

export default Home;
