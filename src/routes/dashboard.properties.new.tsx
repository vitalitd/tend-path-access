import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { PropertyMap } from "@/components/PropertyMap";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/properties/new")({
  head: () => ({ meta: [{ title: "Open new land · Tend" }] }),
  component: NewProperty,
});

const ACTIVITY_OPTIONS = ["Walking", "Hiking", "Foraging", "Photography", "Painting", "Wildlife observation", "Silent contemplation"];

function NewProperty() {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [conditions, setConditions] = useState("");
  const [stewardName, setStewardName] = useState("");
  const [acreage, setAcreage] = useState("");
  const [lat, setLat] = useState<number>(54.5);
  const [lng, setLng] = useState<number>(-3.5);
  const [activities, setActivities] = useState<string[]>(["Walking"]);
  const [groupLimit, setGroupLimit] = useState(4);
  const [warnings, setWarnings] = useState("");
  const [price, setPrice] = useState("12");
  const [currency, setCurrency] = useState("GBP");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || role !== "landowner")) {
      navigate({ to: "/auth" });
    }
  }, [user, role, authLoading, navigate]);

  const toggleActivity = (a: string) =>
    setActivities((curr) => (curr.includes(a) ? curr.filter((x) => x !== a) : [...curr, a]));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const { data: prop, error } = await supabase
        .from("properties")
        .insert({
          landowner_id: user.id,
          name,
          region: region || null,
          description: description || null,
          conditions: conditions || null,
          steward_name: stewardName || null,
          acreage: acreage ? Number(acreage) : null,
          latitude: lat,
          longitude: lng,
          allowed_activities: activities,
        })
        .select()
        .single();
      if (error) throw error;

      await Promise.all([
        supabase.from("access_rules").insert({
          property_id: prop.id,
          group_size_limit: groupLimit,
          warnings: warnings || null,
        }),
        supabase.from("pricing").insert({
          property_id: prop.id,
          pricing_type: "per_visit",
          amount: Number(price),
          currency,
        }),
      ]);

      toast.success("Land opened to the registry.");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-paper"><SiteHeader /></div>;

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main className="max-w-[900px] mx-auto px-6 md:px-12 lg:px-16 py-12">
        <p className="label-meta mb-3">§ New entry</p>
        <h1 className="font-display text-4xl md:text-5xl tracking-tighter font-light mb-10">
          Open a parcel to careful passage.
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Property name" required>
              <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
            </Field>
            <Field label="Region">
              <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Cumbria" className={inputCls} />
            </Field>
          </div>

          <Field label="Description">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={inputCls} />
          </Field>

          <Field label="Conditions of passage">
            <textarea value={conditions} onChange={(e) => setConditions(e.target.value)} rows={3} placeholder="e.g. No dogs. Stay on marked paths. Sturdy boots required." className={inputCls} />
          </Field>

          <Field label="Warnings (visible in red)">
            <input value={warnings} onChange={(e) => setWarnings(e.target.value)} placeholder="e.g. Steep ground, livestock present" className={inputCls} />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Steward name">
              <input value={stewardName} onChange={(e) => setStewardName(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Acreage">
              <input value={acreage} onChange={(e) => setAcreage(e.target.value)} type="number" step="0.1" className={inputCls} />
            </Field>
            <Field label="Max group size">
              <input value={groupLimit} onChange={(e) => setGroupLimit(Number(e.target.value))} type="number" min={1} className={inputCls} />
            </Field>
          </div>

          <div>
            <p className="label-meta mb-3">Permitted activities</p>
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_OPTIONS.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => toggleActivity(a)}
                  className={`label-meta px-3 py-1.5 border transition-colors ${
                    activities.includes(a) ? "bg-ink text-paper border-ink" : "border-ink/30 hover:border-ink"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Field label="Price">
              <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min={0} step="0.5" className={inputCls} />
            </Field>
            <Field label="Currency">
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputCls}>
                <option value="GBP">GBP £</option>
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="AUD">AUD $</option>
              </select>
            </Field>
          </div>

          <div>
            <p className="label-meta mb-3">Tap on the map to set the property's location</p>
            <PropertyMap
              markers={[{ lat, lng, label: name || "New property" }]}
              picker
              height="350px"
              onClick={(la, ln) => {
                setLat(la);
                setLng(ln);
              }}
            />
            <p className="label-meta mt-2 font-mono">
              {lat.toFixed(4)}°, {lng.toFixed(4)}°
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || activities.length === 0}
            className="w-full font-mono text-xs uppercase tracking-widest bg-ink text-paper py-4 hover:bg-rust transition-colors disabled:opacity-50"
          >
            {submitting ? "Opening…" : "Open to the registry"}
          </button>
        </form>
      </main>
    </div>
  );
}

const inputCls =
  "w-full bg-paper-soft border border-ink/30 px-3 py-2.5 font-sans text-ink focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-meta block mb-2">
        {label} {required && <span className="text-rust">*</span>}
      </span>
      {children}
    </label>
  );
}
