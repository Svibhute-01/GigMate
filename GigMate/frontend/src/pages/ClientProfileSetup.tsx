import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, dashboardPathFor } from "../lib/api";
import type { User } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Stepper from "../components/Stepper";

const STEPS = ["Personal", "Company"];

type ProfileData = {
  name: string;
  email: string;
  companyName: string;
  industry: string;
  description: string;
};

export default function ClientProfileSetup() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    companyName: user?.clientProfile?.companyName ?? "",
    industry: user?.clientProfile?.industry ?? "",
    description: user?.clientProfile?.description ?? "",
  });

  function update<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setProfileData((prev) => ({ ...prev, [key]: value }));
  }

  const stepValid = useMemo(() => {
    switch (step) {
      case 0:
        return profileData.name.trim().length >= 2;
      case 1:
        return (
          profileData.companyName.trim().length > 0 &&
          profileData.description.trim().length > 0
        );
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
    if (!profileData.companyName.trim() || !profileData.description.trim()) {
      setStep(1);
      setError("Please complete your company info.");
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.post<{ user: User }>("/users/client/profile-setup", {
        name: profileData.name.trim(),
        companyName: profileData.companyName.trim(),
        description: profileData.description.trim(),
        industry: profileData.industry.trim(),
      });
      setUser(data.user);
      navigate(dashboardPathFor("client"), { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-white text-3xl font-semibold">Set up your company profile</h1>
      <p className="text-gray-400 mt-2 mb-6">
        Help freelancers understand who they'd be working with.
      </p>

      <div className="rounded-2xl border border-[#0f3d34] bg-[#062a23] p-6">
        <Stepper steps={STEPS} current={step} />

        <div key={step} className="animate-step space-y-4">
          {step === 0 && (
            <>
              <Field
                label="Your name"
                value={profileData.name}
                onChange={(v) => update("name", v)}
                required
                placeholder="Your full name"
              />
              <Field
                label="Email (cannot be changed)"
                value={profileData.email}
                onChange={() => {}}
                readOnly
              />
            </>
          )}

          {step === 1 && (
            <>
              <Field
                label="Company name"
                value={profileData.companyName}
                onChange={(v) => update("companyName", v)}
                required
                placeholder="Acme Studio"
              />
              <Field
                label="Industry"
                value={profileData.industry}
                onChange={(v) => update("industry", v)}
                placeholder="e.g. SaaS, E-commerce, Education"
              />
              <label className="block">
                <span className="text-xs text-gray-400">Description</span>
                <textarea
                  rows={4}
                  required
                  value={profileData.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="What does your company do?"
                  className="mt-1 w-full px-3 py-2 rounded-md bg-[#031c17] border border-[#0f3d34] text-white outline-none focus:border-[#18c29c]"
                />
              </label>
            </>
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
              disabled={saving || !stepValid}
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
