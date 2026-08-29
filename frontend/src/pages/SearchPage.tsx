import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSearchStore } from "@/stores/search.store";
import ImageUpload from "@/components/search/ImageUpload";

const processingSteps = [
  { label: "Image validated", completedIcon: "check", activeIcon: "clock", pendingIcon: "circle" },
  { label: "Face detected", completedIcon: "check", activeIcon: "clock", pendingIcon: "circle" },
  { label: "Generating face representation", completedIcon: "check", activeIcon: "clock", pendingIcon: "circle" },
  { label: "Searching enrolled profiles", completedIcon: "check", activeIcon: "clock", pendingIcon: "circle" },
  { label: "Ranking possible matches", completedIcon: "check", activeIcon: "clock", pendingIcon: "circle" },
];

function StepIcon({ status }: { status: "completed" | "active" | "pending" }) {
  if (status === "completed") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    );
  }
  if (status === "active") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export default function SearchPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const { searchFaces } = useSearchStore();
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    setIsProcessing(true);
    setCurrentStep(0);
    setError(null);

    try {
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStep(i);
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
      await searchFaces(selectedImage);
      toast.success("Search completed!");
      navigate("/results/new");
    } catch (err: any) {
      setError({
        title: "Search failed",
        message: err.response?.data?.message || "Something went wrong. Please try again.",
      });
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setIsProcessing(false);
    setCurrentStep(0);
    setError(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-[800px] mx-auto">
          {/* Search Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Search by Photo
            </h1>
            <p className="text-base text-slate-500 dark:text-surface-400">
              Upload a photograph to find possible matching profiles.
            </p>
          </div>

          {/* Upload Section */}
          {!isProcessing && !error && (
            <>
              <div className="mb-6">
                <ImageUpload
                  onImageSelect={setSelectedImage}
                  selectedImage={selectedImage}
                  onRemoveImage={() => setSelectedImage(null)}
                />
              </div>

              {/* Privacy Notice */}
              <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-surface-800 rounded-lg mb-6">
                <svg
                  className="w-5 h-5 text-emerald-600 dark:text-primary-400 mt-0.5 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <div className="text-sm text-slate-500 dark:text-surface-400 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">Privacy protected:</strong>{" "}
                  Your search image is processed securely and is{" "}
                  <strong className="text-slate-900 dark:text-white">not</strong> added to the
                  public profile database. Results show possible matches based on
                  facial similarity.
                </div>
              </div>

              {/* Search Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSearch}
                  disabled={!selectedImage}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 dark:bg-primary-500 text-white rounded-lg text-base font-medium hover:bg-emerald-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  Search Profiles
                </button>
              </div>
            </>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-emerald-600 dark:text-primary-400 animate-pulse"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                Analyzing image...
              </h2>
              <div className="flex flex-col gap-3 max-w-[300px] mx-auto text-left">
                {processingSteps.map((step, index) => {
                  let status: "completed" | "active" | "pending" = "pending";
                  if (index < currentStep) status = "completed";
                  else if (index === currentStep) status = "active";

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3 text-sm ${
                        status === "completed"
                          ? "text-emerald-600 dark:text-primary-400"
                          : status === "active"
                          ? "text-emerald-600 dark:text-primary-400"
                          : "text-slate-400 dark:text-surface-500"
                      }`}
                    >
                      <span className="w-5 h-5 flex-shrink-0">
                        <StepIcon status={status} />
                      </span>
                      {step.label}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 max-w-[300px] mx-auto">
                <div className="h-2 bg-slate-100 dark:bg-surface-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 dark:bg-primary-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentStep + 1) / processingSteps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {error.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-surface-400 mb-6 max-w-md mx-auto">
                {error.message}
              </p>
              <button
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 dark:bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 dark:hover:bg-primary-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
