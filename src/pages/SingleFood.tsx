import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, Play } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";

const SingleFood = () => {
  const animationContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const curtain = document.getElementById("curtain");

      gsap.set(curtain, {
        y: 0,
        backgroundColor: "#8F00FF",
        z: 200,
      });

      gsap.to(curtain, {
        delay: 1,
        y: 3000,
        duration: 1,
      });
    },
    { dependencies: [] },
  );

  useGSAP(
    () => {
      const foodImage = document.getElementById("foodImage");
      const foodName = document.getElementById("foodName");
      const foodIngredients = document.getElementById("foodIngredients");
      const foodLocation = document.getElementById("foodLocation");
      const foodCulturalStory = document.getElementById("foodCulturalStory");
      const foodDescription = document.getElementById("foodDescription");
      const foodVideosButton = document.getElementById("foodVideosButton");

      const foodTimeline = gsap.timeline();
      foodTimeline
        .from(foodImage, {
          opacity: 0,
          x: -100,
          duration: 0.6,
          ease: "power2.out",
        })
        .from(foodName, {
          opacity: 0,
          x: 100,
          duration: 0.4,
          ease: "power2.out",
        })
        .from(foodIngredients, {
          opacity: 0,
          x: 100,
          duration: 0.4,
          ease: "power2.out",
        })
        .from(foodLocation, {
          opacity: 0,
          x: -50,
          duration: 0.4,
          ease: "power2.out",
        })
        .from(foodCulturalStory, {
          opacity: 0,
          x: -50,
          duration: 0.4,
          ease: "power2.out",
        })
        .from(foodDescription, {
          opacity: 0,
          x: 50,
          duration: 0.4,
          ease: "power2.out",
        })
        .from(foodVideosButton, {
          opacity: 0,
          x: -50,
          duration: 0.4,
          ease: "power2.out",
        });
    },
    { scope: animationContainerRef },
  );

  useGSAP(
    () => {
      const ball = document.querySelector(".ball");
      if (!ball) return;

      // Center the ball on its transform origin
      gsap.set(ball, {
        xPercent: -50,
        yPercent: -50,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });

      const xTo = gsap.quickTo(ball, "x", { duration: 0.7, ease: "power3" }),
        yTo = gsap.quickTo(ball, "y", { duration: 0.7, ease: "power3" });

      window.addEventListener("mousemove", (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
      });
    },
    { dependencies: [] },
  );

  return (
    <section className="min-h-screen pt-2 lg:px-72">
      <div className="ball pointer-events-none fixed top-0 left-0 h-15 w-15 rounded-full bg-purple-300 -z-10"></div>
      <Link
        to={"/"}
        className="my-5 flex max-w-28 items-center justify-start gap-2"
      >
        <ArrowLeft width={20} />
        Back
      </Link>
      <div
        className="flex flex-col items-center justify-center gap-5"
        ref={animationContainerRef}
      >
        <img
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1081"
          alt="Food_image"
          className="max-h-[700px] w-full rounded-xl object-cover object-center"
          id="foodImage"
        />
        <div className="flex w-full flex-col items-start justify-center">
          <div className="flex w-full flex-col items-start">
            <h1 className="my-1 text-3xl font-bold text-black" id="foodName">
              Food Name
            </h1>
            <p className="text-sm" id="foodIngredients">
              Rice, Beans, Chicken, Tomatoes, Onions
            </p>
            <p className="my-3 text-xs" id="foodLocation">
              Ghana, Greater Accra
            </p>
            <div
              className="my-3 flex w-full flex-col items-start justify-center"
              id="foodCulturalStory"
            >
              <h1 className="text-xl font-bold">Cultural Story:</h1>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Quisquam voluptates repudiandae, deserunt eveniet in
                reprehenderit consectetur fugit non, ratione aliquid tenetur sit
                inventore debitis doloremque dolorum magni expedita cumque nobis
                velit culpa obcaecati maiores. Est quia quis rem placeat. Odit
                numquam quo fugit nobis, praesentium, officia quasi adipisci
                quibusdam aliquam distinctio veritatis commodi? Labore id
                assumenda alias est eaque beatae quidem debitis ad iste!
                Sapiente minus similique sed odio ipsum cupiditate,
                exercitationem nisi in nihil provident? Voluptate, nisi ipsam.
                Quasi assumenda, quos saepe delectus natus quae sint minus dolor
                quisquam, dolores aliquam officiis magnam perferendis odit,
                tempore facere molestiae dolorum.
              </p>
            </div>
            <div
              className="my-3 flex w-full flex-col items-start justify-center"
              id="foodDescription"
            >
              <h1 className="text-xl font-bold">Description:</h1>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Quisquam voluptates repudiandae, deserunt eveniet in
                reprehenderit consectetur fugit non, ratione aliquid tenetur sit
                inventore debitis doloremque dolorum magni expedita cumque nobis
                velit culpa obcaecati maiores. Est quia quis rem placeat. Odit
                numquam quo fugit nobis, praesentium, officia quasi adipisci
                quibusdam aliquam distinctio veritatis commodi? Labore id
                assumenda alias est eaque beatae quidem debitis ad iste!
                Sapiente minus similique sed odio ipsum cupiditate,
                exercitationem nisi in nihil provident? Voluptate, nisi ipsam.
                Quasi assumenda, quos saepe delectus natus quae sint minus dolor
                quisquam, dolores aliquam officiis magnam perferendis odit,
                tempore facere molestiae dolorum.
              </p>
            </div>
            <Link
              to={`/foods/3/videos`}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 py-3 font-semibold text-white transition-colors duration-200 hover:bg-orange-600"
              id="foodVideosButton"
            >
              <Play />
              <p>Prep videos</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleFood;
