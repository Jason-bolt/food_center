import { X } from "lucide-react";
import type React from "react";

interface IPopUpModal {
  selectModalRef: React.RefObject<HTMLDivElement | null>;
  selectModalBackgroundRef: React.RefObject<HTMLDivElement | null>;
  setIsModalOpen: (x: boolean) => void;
  elements: string[];
  onChangeElement: (e: string) => void;
  selectedElement: string;
  type: string;
}

const PopUpModal = ({
  selectModalRef,
  selectModalBackgroundRef,
  setIsModalOpen,
  elements,
  onChangeElement,
  selectedElement,
  type,
}: IPopUpModal) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-28"
      ref={selectModalRef}
    >
      <div
        ref={selectModalBackgroundRef}
        className="absolute inset-0 bg-black/10 backdrop-blur-md"
        onClick={() => setIsModalOpen(false)}
      />

      <div className="relative mx-4 w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/20 shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 bg-gray-200 opacity-90" />

          <div className="relative p-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-white/10 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="mb-6 text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-800">
                Select <span className="capitalize">{type}</span>
              </h2>
              <p className="text-gray-600">
                Choose your preferred <span className="lowercase">{type}</span>
              </p>
            </div>

            <div className="mb-6 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {elements.map((element) => (
                  <button
                    key={element}
                    onClick={() => {
                      onChangeElement?.(element);
                      setIsModalOpen(false);
                    }}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                      selectedElement === element
                        ? "border-blue-500/50 bg-blue-500/20 text-blue-700"
                        : "border-white/20 bg-gray-200 text-gray-700 hover:cursor-pointer hover:border-white/50 hover:bg-gray-100"
                    }`}
                  >
                    {element}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUpModal;
