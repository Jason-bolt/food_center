const Foods = () => {
  // Dummy food data for demonstration
  const foods = [
    {
      id: 1,
      name: "Pasta Carbonara",
      image: "🍝",
      description: "Classic Italian pasta",
    },
    {
      id: 2,
      name: "Chicken Curry",
      image: "🍛",
      description: "Spicy Indian curry",
    },
    {
      id: 3,
      name: "Sushi Roll",
      image: "🍣",
      description: "Fresh Japanese sushi",
    },
    {
      id: 4,
      name: "Beef Burger",
      image: "🍔",
      description: "Juicy American burger",
    },
    {
      id: 5,
      name: "Caesar Salad",
      image: "🥗",
      description: "Fresh green salad",
    },
    {
      id: 6,
      name: "Pizza Margherita",
      image: "🍕",
      description: "Traditional Italian pizza",
    },
    {
      id: 7,
      name: "Fish Tacos",
      image: "🌮",
      description: "Mexican street food",
    },
    {
      id: 8,
      name: "Ramen Bowl",
      image: "🍜",
      description: "Japanese noodle soup",
    },
    {
      id: 9,
      name: "Chicken Wings",
      image: "🍗",
      description: "Crispy fried wings",
    },
    {
      id: 10,
      name: "Fruit Smoothie",
      image: "🥤",
      description: "Healthy fruit blend",
    },
    {
      id: 11,
      name: "Chocolate Cake",
      image: "🍰",
      description: "Rich dessert",
    },
    {
      id: 12,
      name: "Grilled Salmon",
      image: "🐟",
      description: "Fresh fish dish",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-800">
          Food Collection
        </h1>

        <div className="grid grid-cols-2 gap-4">
          {foods.map((food) => (
            <div
              key={food.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{food.image}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {food.name}
                  </h3>
                  <p className="text-sm text-gray-600">{food.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Foods;
