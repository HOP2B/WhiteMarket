import React, { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../api/mockApi";

const CompleteProfile: React.FC = () => {
  const router = useRouter();
  const { user, setProfileCompleted } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvPreview, setCvPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    education: "",
    skills: "",
    phone: "",
    website: "",
    linkedin: "",
    github: "",
    portfolio: "",
    customFields: "",
  });

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
      // Create a preview URL for the uploaded file
      const previewUrl = URL.createObjectURL(file);
      setCvPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      // Prepare CV data (in a real app, this would be uploaded to storage)
      const cvData = cvFile
        ? {
            name: cvFile.name,
            size: cvFile.size,
            type: cvFile.type,
            url: cvPreview, // For demonstration purposes, use the preview URL
          }
        : null;

      await updateUserProfile(user.id, {
        name: formData.fullName,
        bio: formData.bio,
        education: formData.education,
        skills: skillsArray,
        phone: formData.phone,
        website: formData.website,
        linkedin: formData.linkedin,
        github: formData.github,
        portfolio: formData.portfolio,
        customFields: formData.customFields,
        cv: cvData,
        profileCompleted: true,
      });

      // Mark profile as completed in context and localStorage
      setProfileCompleted(true);

      // Redirect to dashboard after successful profile completion
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to complete profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-4 animate-fade-in">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 animate-fade-in">
              Please provide some additional information to complete your
              profile
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="input-field"
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education
              </label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) =>
                  setFormData({ ...formData, education: e.target.value })
                }
                className="input-field"
                placeholder="Your educational background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
                className="input-field"
                placeholder="e.g., Web Development, Graphic Design"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate skills with commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="input-field"
                placeholder="Your phone number"
              />
            </div>

            {/* CV Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CV / Resume (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvUpload}
                  className="input-field"
                />
                {cvFile && (
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Selected: {cvFile.name} (
                      {(cvFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                    {cvPreview && (
                      <div className="mt-2">
                        <a
                          href={cvPreview}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Preview CV
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Upload your CV in PDF, DOC, or DOCX format (max 5MB)
              </p>
            </div>

            {/* Social Media Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website (Optional)
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="input-field"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn (Optional)
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin: e.target.value })
                }
                className="input-field"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub (Optional)
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
                className="input-field"
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio (Optional)
              </label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={(e) =>
                  setFormData({ ...formData, portfolio: e.target.value })
                }
                className="input-field"
                placeholder="https://yourportfolio.com"
              />
            </div>

            {/* Custom Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information (Optional)
              </label>
              <textarea
                value={formData.customFields}
                onChange={(e) =>
                  setFormData({ ...formData, customFields: e.target.value })
                }
                className="input-field"
                rows={3}
                placeholder="Any additional information you'd like to share..."
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Completing..." : "Complete Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
