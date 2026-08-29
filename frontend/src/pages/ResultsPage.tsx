import { Link } from "react-router-dom";
import { useSearchStore } from "@/stores/search.store";
import MatchCard from "@/components/search/MatchCard";

export default function ResultsPage() {
  const { results, isSearching } = useSearchStore();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Possible Matches
              </h1>
              <p className="text-sm text-slate-500 dark:text-surface-400 mt-1">
                {results.length} result{results.length !== 1 ? "s" : ""} found
                &bull; Sorted by similarity
              </p>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-surface-600 rounded-lg text-sm font-medium text-slate-700 dark:text-white bg-white dark:bg-surface-800 hover:bg-slate-50 dark:hover:bg-surface-700 transition-colors no-underline"
            >
              <svg
                width="16"
                height="16"
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
              New Search
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-6">
            <svg
              className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mt-0.5 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p className="text-sm text-amber-800 dark:text-yellow-300 leading-relaxed">
              <strong>Important:</strong> Face similarity is probabilistic and may
              be incorrect. These are possible matches only. Always verify
              information independently before making any assumptions about
              identity.
            </p>
          </div>

          {/* Results List */}
          {results.length > 0 ? (
            <div className="flex flex-col gap-4">
              {results.map((result) => (
                <MatchCard key={result.id} result={result} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-surface-700 text-slate-400 dark:text-surface-500 rounded-full flex items-center justify-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No confident match found
              </h2>
              <p className="text-base text-slate-500 dark:text-surface-400 max-w-md mx-auto mb-6">
                We couldn't find any matching profiles in our database. This
                doesn't mean the person isn't enrolled—it means the face
                similarity wasn't high enough for a confident match.
              </p>
              <Link
                to="/search"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 dark:bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 dark:hover:bg-primary-600 transition-colors no-underline"
              >
                Try Another Search
              </Link>
            </div>
          )}

          {/* Search Again Button */}
          {results.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                to="/search"
                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-surface-600 rounded-lg text-sm font-medium text-slate-700 dark:text-white bg-white dark:bg-surface-800 hover:bg-slate-50 dark:hover:bg-surface-700 transition-colors no-underline"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                Search Again
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
