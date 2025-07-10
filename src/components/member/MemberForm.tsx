import React, { useState } from "react";
import { User, Mail, Award, Code, Trash2 } from "lucide-react";

interface Skill {
  name: string;
  technologies: string[];
  percent: number;
}

interface Education {
  degree: string;
  institution: string;
  description: string;
  imageUrl: string;
}

interface Contacts {
  linkedin: string;
  github: string;
  twitter: string;
  telegram: string;
}

interface MemberData {
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  education: Education;
  contacts: Contacts;
  skills: Skill[];
}

const MemberForm: React.FC = () => {
  const [formData, setFormData] = useState<MemberData>({
    name: "",
    role: "",
    imageUrl: "",
    bio: "",
    education: {
      degree: "",
      institution: "",
      description: "",
      imageUrl: "",
    },
    contacts: {
      linkedin: "",
      github: "",
      twitter: "",
      telegram: "",
    },
    skills: [],
  });

  const [newSkill, setNewSkill] = useState<Skill>({
    name: "",
    technologies: [],
    percent: 0,
  });

  const [techInput, setTechInput] = useState("");
  const [isSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (
    section: "education",
    field: keyof Education,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleContactChange = (field: keyof Contacts, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [field]: value,
      },
    }));
  };

  const addTechnology = () => {
    if (techInput.trim()) {
      setNewSkill((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput("");
    }
  };

  const removeTechnology = (index: number) => {
    setNewSkill((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (formData.skills.length >= 4) {
      alert("You can only add up to 4 skills.");
      return;
    }

    if (newSkill.name && newSkill.technologies.length && newSkill.percent) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill({ name: "", technologies: [], percent: 0 });
    }
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-950  px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <User className="h-8 w-8" />
              Member Profile Registration
            </h1>
            <p className="text-blue-100 mt-2">
              Fill out the form below to provide your profile
            </p>
          </div>

          <div className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Basic Information
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Enter the member's basic details
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Role/Position *
                  </label>
                  <input
                    name="role"
                    type="text"
                    required
                    placeholder="e.g., Software Engineer, Designer"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Image URL
                  </label>
                  <input
                    name="imageUrl"
                    type="url"
                    placeholder="https://example.com/profile-image.jpg"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Bio *
                  </label>
                  <textarea
                    name="bio"
                    required
                    rows={4}
                    placeholder="Tell us about yourself, your background, and interests..."
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Education
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Educational background and qualifications
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Degree *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Bachelor of Computer Science"
                    value={formData.education.degree}
                    onChange={(e) =>
                      handleNestedChange("education", "degree", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Institution *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., University of Rwanda"
                    value={formData.education.institution}
                    onChange={(e) =>
                      handleNestedChange(
                        "education",
                        "institution",
                        e.target.value,
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    University Logo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/university-logo.png"
                    value={formData.education.imageUrl}
                    onChange={(e) =>
                      handleNestedChange(
                        "education",
                        "imageUrl",
                        e.target.value,
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your educational experience, achievements, or relevant coursework..."
                    value={formData.education.description}
                    onChange={(e) =>
                      handleNestedChange(
                        "education",
                        "description",
                        e.target.value,
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-600" />
                  Contact Information
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Social media and professional links
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.contacts.linkedin}
                    onChange={(e) =>
                      handleContactChange("linkedin", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    GitHub
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={formData.contacts.github}
                    onChange={(e) =>
                      handleContactChange("github", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Twitter
                  </label>
                  <input
                    type="url"
                    placeholder="https://twitter.com/username"
                    value={formData.contacts.twitter}
                    onChange={(e) =>
                      handleContactChange("twitter", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Telegram
                  </label>
                  <input
                    type="url"
                    placeholder="https://t.me/username"
                    value={formData.contacts.telegram}
                    onChange={(e) =>
                      handleContactChange("telegram", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Code className="h-5 w-5 text-orange-600" />
                  Skills & Technologies
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Add your technical skills and proficiency levels
                </p>
              </div>

              {/* Add New Skill */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="font-medium text-gray-800">Add New Skill</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Frontend Development"
                      value={newSkill.name}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Proficiency Level (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="85"
                      value={newSkill.percent || ""}
                      onChange={(e) =>
                        setNewSkill({
                          ...newSkill,
                          percent: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Technologies
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., React, TypeScript, Node.js"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addTechnology())
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={addTechnology}
                      className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {newSkill.technologies.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Selected Technologies
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {newSkill.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechnology(index)}
                            className="hover:text-orange-600 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={addSkill}
                  disabled={
                    !newSkill.name ||
                    !newSkill.technologies.length ||
                    !newSkill.percent
                  }
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Add Skill
                </button>
              </div>

              {/* Skills List */}
              {formData.skills.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">Added Skills</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-4 relative"
                      >
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="pr-8">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-800">
                              {skill.name}
                            </h4>
                            <span className="text-sm font-medium text-orange-600">
                              {skill.percent}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                            <div
                              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${skill.percent}%` }}
                            ></div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {skill.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-950  text-white py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg"
              >
                {isSubmitting
                  ? "Confirming Profile..."
                  : "Confirm Member Information"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberForm;
