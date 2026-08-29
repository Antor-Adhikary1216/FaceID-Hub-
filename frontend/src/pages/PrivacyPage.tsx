import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/auth.store";
import { useProfileStore } from "@/stores/profile.store";
import { profileService } from "@/services/profile.service";
import Sidebar from "@/components/layout/Sidebar";

export default function PrivacyPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { profile, fetchMyProfile } = useProfileStore();
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    fetchMyProfile();
  }, [fetchMyProfile]);

  const handleToggle = async (field: "isPublic" | "allowMatching") => {
    if (!profile) return;
    try {
      await profileService.updateProfile({
        bio: profile.bio || "",
        location: profile.location || "",
        company: profile.company || "",
        jobTitle: profile.jobTitle || "",
        isPublic: field === "isPublic" ? !profile.isPublic : profile.isPublic,
        allowMatching: field === "allowMatching" ? !profile.allowMatching : profile.allowMatching,
        skills: profile.skills.map((s) => s.name),
        socialLinks: profile.socialLinks,
      });
      fetchMyProfile();
      toast.success("Settings updated");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  const handleDeleteBiometricData = async () => {
    if (!profile) return;
    try {
      for (const embedding of profile.faceEmbeddings) {
        await profileService.removeFaceEmbedding(embedding.id);
      }
      fetchMyProfile();
      setShowBiometricModal(false);
      toast.success("Biometric data deleted. Your profile will no longer appear in search results.");
    } catch (error) {
      toast.error("Failed to delete biometric data");
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") return;
    setIsDeleting(true);
    try {
      await profileService.deleteProfile();
      await logout();
      toast.success("Account deleted. All your data has been permanently removed.");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-[800px] mx-auto">
          {/* Privacy Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Privacy Center
            </h1>
            <p className="text-base text-slate-500 dark:text-surface-400">
              Control how your information is shared and used on FaceProfile.
            </p>
          </div>

          {/* Profile Visibility */}
          <div className="bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Profile Visibility
            </h2>
            <p className="text-sm text-slate-500 dark:text-surface-400 mb-6 leading-relaxed">
              Control who can see your profile when someone searches for you.
              Your profile information will only be shared with users who have a
              possible face match.
            </p>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface-900 rounded-lg">
              <div className="flex-1">
                <p className="text-base font-medium text-slate-900 dark:text-white mb-0.5">
                  Profile visibility
                </p>
                <p className="text-sm text-slate-500 dark:text-surface-400">
                  Make your profile visible to search results
                </p>
              </div>
              <button
                onClick={() => handleToggle("isPublic")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  profile?.isPublic ? "bg-emerald-600" : "bg-slate-300 dark:bg-surface-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    profile?.isPublic ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Face Matching */}
          <div className="bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Face Matching
            </h2>
            <p className="text-sm text-slate-500 dark:text-surface-400 mb-6 leading-relaxed">
              Enable or disable face matching for your profile. When enabled,
              your profile may appear in search results when someone uploads a
              similar photo.
            </p>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface-900 rounded-lg">
              <div className="flex-1">
                <p className="text-base font-medium text-slate-900 dark:text-white mb-0.5">
                  Face matching
                </p>
                <p className="text-sm text-slate-500 dark:text-surface-400">
                  Allow your profile to appear in face search results
                </p>
              </div>
              <button
                onClick={() => handleToggle("allowMatching")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  profile?.allowMatching ? "bg-emerald-600" : "bg-slate-300 dark:bg-surface-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    profile?.allowMatching ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Search Participation */}
          <div className="bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Search Participation
            </h2>
            <p className="text-sm text-slate-500 dark:text-surface-400 mb-6 leading-relaxed">
              Control whether your profile is included in the search database.
              This does not affect your ability to search for others.
            </p>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface-900 rounded-lg">
              <div className="flex-1">
                <p className="text-base font-medium text-slate-900 dark:text-white mb-0.5">
                  Search participation
                </p>
                <p className="text-sm text-slate-500 dark:text-surface-400">
                  Include your profile in the searchable database
                </p>
              </div>
              <button
                onClick={() => handleToggle("allowMatching")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  profile?.allowMatching ? "bg-emerald-600" : "bg-slate-300 dark:bg-surface-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    profile?.allowMatching ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Biometric Data */}
          <div className="bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Biometric Data
            </h2>
            <p className="text-sm text-slate-500 dark:text-surface-400 mb-6 leading-relaxed">
              Your face representation is generated from your profile photo and
              used for matching. You can delete this data at any time, which will
              remove your profile from search results.
            </p>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface-900 rounded-lg">
              <div className="flex-1">
                <p className="text-base font-medium text-slate-900 dark:text-white mb-0.5">
                  Biometric data stored
                </p>
                <p className="text-sm text-slate-500 dark:text-surface-400">
                  Face representation for matching purposes
                </p>
              </div>
              <button
                onClick={() => setShowBiometricModal(true)}
                className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-surface-600 rounded-lg text-sm font-medium text-slate-700 dark:text-surface-300 bg-white dark:bg-surface-800 hover:bg-slate-50 dark:hover:bg-surface-700 transition-colors"
              >
                Manage
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-surface-800 border border-red-500 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
              Danger Zone
            </h2>
            <p className="text-sm text-slate-500 dark:text-surface-400 mb-6 leading-relaxed">
              These actions are permanent and cannot be undone. Please proceed
              with caution.
            </p>
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mb-3">
              <div className="flex-1">
                <p className="text-base font-medium text-slate-900 dark:text-white mb-0.5">
                  Delete biometric data
                </p>
                <p className="text-sm text-slate-500 dark:text-surface-400">
                  Remove your face representation from the system
                </p>
              </div>
              <button
                onClick={() => setShowBiometricModal(true)}
                className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex-1">
                <p className="text-base font-medium text-slate-900 dark:text-white mb-0.5">
                  Delete account
                </p>
                <p className="text-sm text-slate-500 dark:text-surface-400">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <button
                onClick={() => setShowDeleteAccountModal(true)}
                className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Biometric Data Modal */}
      {showBiometricModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowBiometricModal(false);
          }}
        >
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 pb-0">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Delete Biometric Data
              </h3>
              <button
                onClick={() => setShowBiometricModal(false)}
                className="text-slate-400 dark:text-surface-500 hover:text-slate-600 dark:hover:text-surface-300"
                aria-label="Close modal"
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-500 dark:text-surface-400 mb-4">
                Are you sure you want to delete your biometric data? This will
                remove your face representation from the system and your profile
                will no longer appear in search results.
              </p>
              <p className="text-sm text-slate-400 dark:text-surface-500">
                You can re-enroll by uploading a new profile photo.
              </p>
            </div>
            <div className="flex justify-end gap-3 p-6 pt-0">
              <button
                onClick={() => setShowBiometricModal(false)}
                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-surface-600 rounded-lg text-sm font-medium text-slate-700 dark:text-surface-300 bg-white dark:bg-surface-800 hover:bg-slate-50 dark:hover:bg-surface-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBiometricData}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteAccountModal(false);
              setConfirmText("");
            }
          }}
        >
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 pb-0">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Delete Account
              </h3>
              <button
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setConfirmText("");
                }}
                className="text-slate-400 dark:text-surface-500 hover:text-slate-600 dark:hover:text-surface-300"
                aria-label="Close modal"
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-500 dark:text-surface-400 mb-4">
                Are you sure you want to delete your account? This action is
                permanent and cannot be undone.
              </p>
              <p className="text-sm text-slate-400 dark:text-surface-500 mb-4">
                This will permanently delete:
              </p>
              <ul className="text-sm text-slate-400 dark:text-surface-500 ml-5 list-disc space-y-1 mb-4">
                <li>Your profile information</li>
                <li>Your biometric data</li>
                <li>Your search history</li>
                <li>All associated data</li>
              </ul>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-surface-300 mb-1">
                  Type <span className="font-bold">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-slate-900 dark:text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="DELETE"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 pt-0">
              <button
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setConfirmText("");
                }}
                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-surface-600 rounded-lg text-sm font-medium text-slate-700 dark:text-surface-300 bg-white dark:bg-surface-800 hover:bg-slate-50 dark:hover:bg-surface-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={confirmText !== "DELETE" || isDeleting}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
