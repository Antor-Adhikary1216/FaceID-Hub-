import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useProfileStore } from "@/stores/profile.store";
import Sidebar from "@/components/layout/Sidebar";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { ProfileFormData } from "@/types";

const profileSchema = z.object({
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  location: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  isPublic: z.boolean(),
  allowMatching: z.boolean(),
  skills: z.array(z.string()),
  socialLinks: z.array(
    z.object({
      platform: z.string(),
      url: z.string(),
    })
  ),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { profile, isLoading, fetchMyProfile, updateProfile } = useProfileStore();
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: "",
      location: "",
      company: "",
      jobTitle: "",
      isPublic: true,
      allowMatching: true,
      skills: [],
      socialLinks: [],
    },
  });

  const skills = watch("skills");
  const socialLinks = watch("socialLinks");

  useEffect(() => {
    fetchMyProfile();
  }, [fetchMyProfile]);

  useEffect(() => {
    if (profile) {
      setValue("bio", profile.bio || "");
      setValue("location", profile.location || "");
      setValue("company", profile.company || "");
      setValue("jobTitle", profile.jobTitle || "");
      setValue("isPublic", profile.isPublic);
      setValue("allowMatching", profile.allowMatching);
      setValue(
        "skills",
        profile.skills.map((s) => s.name)
      );
      setValue("socialLinks", profile.socialLinks);
      if (profile.banner) setBannerPreview(profile.banner);
      if (profile.avatar) setAvatarPreview(profile.avatar);
    }
  }, [profile, setValue]);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setBannerPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setValue("skills", [...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setValue(
      "skills",
      skills.filter((s) => s !== skill)
    );
  };

  const addSocialLink = () => {
    setValue("socialLinks", [...socialLinks, { platform: "website", url: "" }]);
  };

  const updateSocialLink = (
    index: number,
    field: "platform" | "url",
    value: string
  ) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setValue("socialLinks", updated);
  };

  const removeSocialLink = (index: number) => {
    setValue(
      "socialLinks",
      socialLinks.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const formData: ProfileFormData = {
        ...data,
        banner: bannerFile || undefined,
        avatar: avatarFile || undefined,
      };
      await updateProfile(formData);
      toast.success("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Edit Profile</h1>
          <p className="mt-1 text-surface-600 dark:text-surface-400">
            Update your profile information
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Banner Image
              </label>
              <div
                onClick={() => bannerInputRef.current?.click()}
                className="h-[200px] bg-gradient-to-r from-[#1a7a5c] to-[#15654a] rounded-xl cursor-pointer overflow-hidden"
              >
                {bannerPreview ? (
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-white/80 gap-2">
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Click to upload banner</span>
                    <span className="text-xs text-white/60">PNG, JPG up to 5MB</span>
                  </div>
                )}
              </div>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="hidden"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Profile Photo
              </label>
              <div className="relative inline-block">
                <div
                  onClick={() => avatarInputRef.current?.click()}
                  className="w-24 h-24 rounded-full bg-surface-100 dark:bg-surface-700 cursor-pointer overflow-hidden border-4 border-white dark:border-surface-800 shadow-sm -mt-12 relative z-10"
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-400 dark:text-surface-500">
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Bio
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about yourself..."
                className="block w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500 focus:border-[#1a7a5c] focus:outline-none focus:ring-2 focus:ring-[#1a7a5c]/20 transition-colors duration-200 resize-none"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                  {errors.bio.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Location"
                placeholder="San Francisco, CA"
                {...register("location")}
              />
              <Input
                label="Company"
                placeholder="Acme Inc."
                {...register("company")}
              />
            </div>

            <Input
              label="Job Title"
              placeholder="Software Engineer"
              {...register("jobTitle")}
            />

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Skills
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Add a skill"
                  className="flex-1 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500 focus:border-[#1a7a5c] focus:outline-none focus:ring-2 focus:ring-[#1a7a5c]/20 transition-colors duration-200"
                />
                <Button type="button" onClick={addSkill} variant="secondary">
                  Add
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 bg-[#1a7a5c]/10 dark:bg-primary-900/30 text-[#1a7a5c] dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-[#15654a] dark:hover:text-primary-300 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Social Links
              </label>
              <div className="space-y-3">
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <select
                      value={link.platform}
                      onChange={(e) =>
                        updateSocialLink(index, "platform", e.target.value)
                      }
                      className="w-32 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-surface-900 dark:text-white focus:border-[#1a7a5c] focus:outline-none focus:ring-2 focus:ring-[#1a7a5c]/20 transition-colors duration-200"
                    >
                      <option value="website">Website</option>
                      <option value="github">GitHub</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter</option>
                    </select>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) =>
                        updateSocialLink(index, "url", e.target.value)
                      }
                      placeholder="https://..."
                      className="flex-1 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500 focus:border-[#1a7a5c] focus:outline-none focus:ring-2 focus:ring-[#1a7a5c]/20 transition-colors duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialLink(index)}
                      className="text-surface-400 dark:text-surface-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addSocialLink}
                  variant="ghost"
                  size="sm"
                >
                  + Add social link
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-surface-300 dark:border-surface-600 text-[#1a7a5c] focus:ring-[#1a7a5c]"
                  {...register("isPublic")}
                />
                <div>
                  <span className="text-sm font-medium text-surface-900 dark:text-white">
                    Public Profile
                  </span>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    Allow others to view your profile
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-surface-300 dark:border-surface-600 text-[#1a7a5c] focus:ring-[#1a7a5c]"
                  {...register("allowMatching")}
                />
                <div>
                  <span className="text-sm font-medium text-surface-900 dark:text-white">
                    Allow Face Matching
                  </span>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    Allow others to find you via face search
                  </p>
                </div>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
