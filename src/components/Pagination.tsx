import { useSearchParams } from "react-router-dom";

const Pagination = ({
  totalPages,
  page,
}: {
  totalPages: number;
  page: number;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const handlePrevClick = () => {
    if (page > 1) {
      newSearchParams.set("page", (page - 1).toString());
      setSearchParams(newSearchParams);
    }
  };

  const handleNextClick = () => {
    if (page < totalPages) {
      newSearchParams.set("page", (page + 1).toString());
      setSearchParams(newSearchParams);
    }
  };
  return (
    <div
      id={"pagination"}
      className="mt-5 flex items-center justify-center gap-5"
    >
      <button
        className={`px-4 py-2 font-semibold text-green-500 ${page === 1 ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer hover:underline"}`}
        onClick={handlePrevClick}
      >
        Prev
      </button>
      <div className="flex items-center justify-center gap-2">
        <p>{page}</p>
        <p className="text-xs">of</p>
        <p>{totalPages}</p>
      </div>
      <button
        className={`px-4 py-2 font-semibold text-blue-500 ${page === totalPages ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer hover:underline"}`}
        onClick={handleNextClick}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
