import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

interface LoginRequiredPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginRequiredPopup({
  isOpen,
  onClose,
}: LoginRequiredPopupProps) {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleSignup = () => {
    onClose();
    navigate("/signup");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <div className="w-16 h-16 bg-[#d1f5e8] dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-8 h-8 text-[#1a7a5c] dark:text-primary-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-[#0f172a] dark:text-white mb-2">
          Login Required
        </h3>
        <p className="text-[#64748b] dark:text-surface-400 mb-6 leading-relaxed">
          You need to log in to access full features. Sign in to search faces,
          view match results, and manage your profile.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogin}
            className="w-full px-6 py-3 rounded-lg bg-[#1a7a5c] text-white font-semibold hover:bg-[#15644a] dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
          >
            Log In
          </button>
          <button
            onClick={handleSignup}
            className="w-full px-6 py-3 rounded-lg border border-[#1a7a5c] text-[#1a7a5c] font-semibold hover:bg-[#1a7a5c]/5 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20 transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    </Modal>
  );
}
