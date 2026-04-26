import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, dashboardPathFor } from "../lib/api";
import type { User } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Stepper from "../components/Stepper";
import TagInput from "../components/TagInput";

const STEPS = ["Personal", "Education", "Skills", "Portfolio"];

type ProfileData = {
  name: string;
  email: string;
  bio: string;
  college: string;
  degree: string;
  year: string;
  skills: string[];
  portfolioLinks: string[];
  projects: string[];
};

export default function StudentProfileSetup() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    bio: user?.studentProfile?.bio ?? "",
    college: user?.studentProfile?.college ?? "",
    degree: user?.studentProfile?.degree ?? "",
    year: user?.studentProfile?.year ?? "",
    skills: user?.studentProfile?.skills ?? [],
    portfolioLinks: user?.studentProfile?.portfolioLinks ?? [],
    projects: user?.studentProfile?.projects ?? [],
  });

  function update<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setProfileData((prev) => ({ ...prev, [key]: value }));
  }

  const stepValid = useMemo(() => {
    switch (step) {
      case 0:
        return profileData.name.trim().length >= 2;
      case 1:
        return profileData.college.trim().length > 0;
      case 2:
        return profileData.skills.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  }, [step, profileData]);

  function next() {
    setError(null);
    if (!stepValid) {
      setError("Please fill in the required fields before continuing.");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    setError(null);
    if (profileData.skills.length === 0) {
      setStep(2);
      setError("Please add at least one skill.");
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.post<{ user: User }>("/users/student/profile-setup", {
        name: profileData.name.trim(),
        college: profileData.college.trim(),
        degree: profileData.degree.trim(),
        year: profileData.year.trim(),
        bio: profileData.bio.trim(),
        skills: profileData.skills,
        portfolioLinks: profileData.portfolioLinks,
        projects: profileData.projects,
      });
      setUser(data.user);
      navigate(dashboardPathFor("student"), { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-white text-3xl font-semibold">Set up your freelancer profile</h1>
      <p className="text-gray-400 mt-2 mb-6">
        A few quick steps so clients can hire you with confidence.
      </p>

      <div className="rounded-2xl border border-[#0f3d34] bg-[#062a23] p-6">
        <Stepper steps={STEPS} current={step} />

        <div key={step} className="animate-step space-y-4">
          {step === 0 && (
            <PersonalStep
              name={profileData.name}
              email={profileData.email}
              bio={profileData.bio}
              onName={(v) => update("name", v)}
              onBio={(v) => update("bio", v)}
            />
          )}
          {step === 1 && (
            <EducationStep
              college={profileData.college}
              degree={profileData.degree}
              year={profileData.year}
              onCollege={(v) => update("college", v)}
              onDegree={(v) => update("degree", v)}
              onYear={(v) => update("year", v)}
            />
          )}
          {step === 2 && (
            <SkillsStep
              skills={profileData.skills}
              onSkills={(v) => update("skills", v)}
            />
          )}
          {step === 3 && (
            <PortfolioStep
              portfolioLinks={profileData.portfolioLinks}
              projects={profileData.projects}
              onPortfolioLinks={(v) => update("portfolioLinks", v)}
              onProjects={(v) => update("projects", v)}
            />
          )}
        </div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 0 || saving}
            className="px-4 py-2 rounded-xl border border-[#0f3d34] text-gray-200 hover:bg-[#0a3429] disabled:opacity-40"
          >
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              disabled={!stepValid}
              className="px-5 py-2.5 rounded-xl bg-[#18c29c] text-black font-semibold hover:opacity-90 disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#18c29c] text-black font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Complete Profile"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PersonalStep({
  name,
  email,
  bio,
  onName,
  onBio,
}: {
  name: string;
  email: string;
  bio: string;
  onName: (v: string) => void;
  onBio: (v: string) => void;
}) {
  return (
    <>
      <Field label="Full name" value={name} onChange={onName} required placeholder="Your full name" />
      <Field label="Email (cannot be changed)" value={email} onChange={() => {}} readOnly />
      <label className="block">
        <span className="text-xs text-gray-400">Short bio</span>
        <textarea
          rows={4}
          value={bio}
          onChange={(e) => onBio(e.target.value)}
          placeholder="Briefly describe your experience and what you love working on."
          className="mt-1 w-full px-3 py-2 rounded-md bg-[#031c17] border border-[#0f3d34] text-white outline-none focus:border-[#18c29c]"
        />
      </label>
    </>
  );
}

function EducationStep({
  college,
  degree,
  year,
  onCollege,
  onDegree,
  onYear,
}: {
  college: string;
  degree: string;
  year: string;
  onCollege: (v: string) => void;
  onDegree: (v: string) => void;
  onYear: (v: string) => void;
}) {
  return (
    <>
      <Field label="College / University" value={college} onChange={onCollege} required placeholder="e.g. IIT Bombay" />
      <Field label="Degree (optional)" value={degree} onChange={onDegree} placeholder="e.g. B.Tech Computer Science" />
      <Field label="Year (optional)" value={year} onChange={onYear} placeholder="e.g. 3rd year, 2026" />
    </>
  );
}

function SkillsStep({
  skills,
  onSkills,
}: {
  skills: string[];
  onSkills: (v: string[]) => void;
}) {
  return (
    <TagInput
      label="Skills"
      values={skills}
      onChange={onSkills}
      placeholder="Type a skill and press Enter"
      helper="Add at least one skill. Press Enter or comma to add."
    />
  );
}

function PortfolioStep({
  portfolioLinks,
  projects,
  onPortfolioLinks,
  onProjects,
}: {
  portfolioLinks: string[];
  projects: string[];
  onPortfolioLinks: (v: string[]) => void;
  onProjects: (v: string[]) => void;
}) {
  return (
    <>
      <TagInput
        label="Portfolio links (optional)"
        values={portfolioLinks}
        onChange={onPortfolioLinks}
        placeholder="https://github.com/you"
        helper="Add links to your GitHub, Dribbble, personal site, etc."
      />
      <TagInput
        label="Projects (optional)"
        values={projects}
        onChange={onProjects}
        placeholder="Project name or short description"
        helper="Highlight a few projects you're proud of."
      />
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs text-gray-400">{label}</span>
      <input
        required={required}
        readOnly={readOnly}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "mt-1 w-full px-3 py-2 rounded-md bg-[#031c17] border border-[#0f3d34] text-white outline-none focus:border-[#18c29c]",
          readOnly ? "opacity-70 cursor-not-allowed" : "",
        ].join(" ")}
      />
    </label>
  );
}
