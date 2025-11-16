import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="min-h-screen pt-2 lg:px-72">
      <div className="flex h-screen flex-col items-center justify-center gap-5">
        <h1 className="text-6xl font-bold text-purple-500">404</h1>
        <p className="text-lg">Page not found</p>
        <Link to={"/"} className="text-blue-500">
          Go back to home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
