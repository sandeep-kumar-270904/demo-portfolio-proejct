// Structured (non-JSON) editors for every Project Detail page section.
// Keeps the admin panel fully in sync with what ProjectDetail.tsx renders.
import { AdminInput, AdminTextarea } from "./AdminUI";
import ImageUploader from "./ImageUploader";

export type StatItem = { value: string; label: string; context?: string };
export type ArchNode = { label: string; sub?: string; x?: number; y?: number };
export type Architecture = { nodes?: ArchNode[]; edges?: [number, number][] };
export type FeatureDeep = { title: string; description?: string; images?: string[]; video_url?: string | null };
export type SideCard = { h: string; p: string };
export type KeyDecision = { chose?: string; instead_of?: string; because?: string };
export type StackGroup = { name: string; items: string[]; why?: string };
export type GlanceMedia = { problem?: string[]; solution?: string[]; features?: string[] };
export type ArchImage = { name?: string; url: string; caption?: string };

export type DetailFields = {
  hero_images: string[];
  stats: StatItem[];
  glance_media: GlanceMedia;
  architecture: Architecture;
  architecture_images: ArchImage[];
  features_deep: FeatureDeep[];
  frontend_cards: SideCard[];
  backend_cards: SideCard[];
  key_decision: KeyDecision;
  stack_groups: StackGroup[];
};

export const emptyDetailFields: DetailFields = {
  hero_images: [],
  stats: [],
  glance_media: {},
  architecture: { nodes: [], edges: [] },
  architecture_images: [],
  features_deep: [],
  frontend_cards: [],
  backend_cards: [],
  key_decision: {},
  stack_groups: [],
};

export function normalizeDetailFields(r: Partial<DetailFields> | null | undefined): DetailFields {
  return {
    hero_images: r?.hero_images ?? [],
    stats: r?.stats ?? [],
    glance_media: r?.glance_media ?? {},
    architecture: {
      nodes: r?.architecture?.nodes ?? [],
      edges: r?.architecture?.edges ?? [],
    },
    architecture_images: r?.architecture_images ?? [],
    features_deep: r?.features_deep ?? [],
    frontend_cards: r?.frontend_cards ?? [],
    backend_cards: r?.backend_cards ?? [],
    key_decision: r?.key_decision ?? {},
    stack_groups: r?.stack_groups ?? [],
  };
}

/* ---------- small primitives ---------- */

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-xl border border-soft-2 bg-void/30 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h5 className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">{title}</h5>
        {hint && <span className="font-mono text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 rounded-md border border-acid/40 bg-acid/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-acid hover:bg-acid/20"
    >
      + {label}
    </button>
  );
}

function ItemShell({
  index,
  onRemove,
  onUp,
  onDown,
  children,
}: {
  index: number;
  onRemove: () => void;
  onUp: () => void;
  onDown: () => void;
  children: React.ReactNode;
}) {
  const btn =
    "rounded-md border border-soft-2 bg-surface px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-2 hover:border-acid/40";
  return (
    <div className="mb-3 rounded-lg border border-soft-2 bg-surface/50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          #{index + 1}
        </span>
        <div className="flex gap-1">
          <button type="button" className={btn} onClick={onUp}>
            ↑
          </button>
          <button type="button" className={btn} onClick={onDown}>
            ↓
          </button>
          <button
            type="button"
            className="rounded-md border border-soft-2 bg-surface px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-2 hover:border-nova/40 hover:text-nova"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Repeatable list of images with upload + URL paste. */
function ImageList({
  label,
  value,
  onChange,
  prefix,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  prefix: string;
}) {
  return (
    <div>
      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-2 space-y-3">
        {value.map((url, i) => (
          <div key={i} className="rounded-lg border border-soft-2 bg-surface/50 p-3">
            <ImageUploader
              bucket="project-images"
              label={`Image ${i + 1}`}
              prefix={`${prefix}-${i + 1}`}
              value={url}
              onChange={(u) => onChange(value.map((x, j) => (j === i ? u : x)))}
            />
            <div className="mt-2 flex items-end gap-2">
              <div className="flex-1">
                <AdminInput
                  label="…or paste URL"
                  value={url}
                  onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))}
                />
              </div>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="mb-2 rounded-md border border-soft-2 bg-surface px-2 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-2 hover:border-nova/40 hover:text-nova"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={() => onChange(move(value, i, i - 1))}
                className="mb-2 rounded-md border border-soft-2 bg-surface px-2 py-2 font-mono text-[10px] text-ink-2 hover:border-acid/40"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => onChange(move(value, i, i + 1))}
                className="mb-2 rounded-md border border-soft-2 bg-surface px-2 py-2 font-mono text-[10px] text-ink-2 hover:border-acid/40"
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>
      <AddButton onClick={() => onChange([...value, ""])} label="Add image" />
    </div>
  );
}

/* ---------- main editor ---------- */

export default function ProjectDetailFields({
  value,
  onChange,
  slugPrefix,
}: {
  value: DetailFields;
  onChange: (next: DetailFields) => void;
  slugPrefix: string;
}) {
  const set = <K extends keyof DetailFields>(key: K, v: DetailFields[K]) =>
    onChange({ ...value, [key]: v });

  const nodes = value.architecture.nodes ?? [];
  const edges = value.architecture.edges ?? [];

  return (
    <div>
      <Section title="Hero media" hint="2+ images become an auto-carousel">
        <ImageList
          label="Hero images"
          value={value.hero_images}
          onChange={(v) => set("hero_images", v)}
          prefix={`${slugPrefix}-hero`}
        />
      </Section>

      <Section title="Impact stats" hint="Shown with count-up on the detail page">
        {value.stats.map((s, i) => (
          <ItemShell
            key={i}
            index={i}
            onRemove={() => set("stats", value.stats.filter((_, j) => j !== i))}
            onUp={() => set("stats", move(value.stats, i, i - 1))}
            onDown={() => set("stats", move(value.stats, i, i + 1))}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <AdminInput
                label="Value"
                value={s.value}
                placeholder="200+"
                onChange={(v) => set("stats", value.stats.map((x, j) => (j === i ? { ...x, value: v } : x)))}
              />
              <AdminInput
                label="Label"
                value={s.label}
                placeholder="Active users"
                onChange={(v) => set("stats", value.stats.map((x, j) => (j === i ? { ...x, label: v } : x)))}
              />
              <AdminInput
                label="Context (optional)"
                value={s.context ?? ""}
                placeholder="90-day window"
                onChange={(v) => set("stats", value.stats.map((x, j) => (j === i ? { ...x, context: v } : x)))}
              />
            </div>
          </ItemShell>
        ))}
        <AddButton onClick={() => set("stats", [...value.stats, { value: "", label: "", context: "" }])} label="Add stat" />
      </Section>

      <Section title="At a glance — media" hint="Images beside Problem / Solution / Features">
        <div className="space-y-4">
          {(["problem", "solution", "features"] as const).map((k) => (
            <ImageList
              key={k}
              label={`${k} images`}
              value={value.glance_media[k] ?? []}
              prefix={`${slugPrefix}-glance-${k}`}
              onChange={(v) => set("glance_media", { ...value.glance_media, [k]: v })}
            />
          ))}
        </div>
      </Section>

      <Section title="Architecture diagram" hint="Nodes + connections">
        {nodes.map((n, i) => (
          <ItemShell
            key={i}
            index={i}
            onRemove={() =>
              set("architecture", {
                nodes: nodes.filter((_, j) => j !== i),
                edges: edges
                  .filter(([a, b]) => a !== i && b !== i)
                  .map(([a, b]) => [a > i ? a - 1 : a, b > i ? b - 1 : b] as [number, number]),
              })
            }
            onUp={() => set("architecture", { nodes: move(nodes, i, i - 1), edges })}
            onDown={() => set("architecture", { nodes: move(nodes, i, i + 1), edges })}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AdminInput
                label="Node label"
                value={n.label}
                placeholder="Client"
                onChange={(v) =>
                  set("architecture", { nodes: nodes.map((x, j) => (j === i ? { ...x, label: v } : x)), edges })
                }
              />
              <AdminInput
                label="Subtitle"
                value={n.sub ?? ""}
                placeholder="React SPA"
                onChange={(v) =>
                  set("architecture", { nodes: nodes.map((x, j) => (j === i ? { ...x, sub: v } : x)), edges })
                }
              />
            </div>
          </ItemShell>
        ))}
        <AddButton
          onClick={() => set("architecture", { nodes: [...nodes, { label: "", sub: "" }], edges })}
          label="Add node"
        />

        <div className="mt-5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Connections
          </span>
          {edges.map(([a, b], i) => (
            <div key={i} className="mt-2 flex items-center gap-2">
              <select
                value={a}
                onChange={(e) =>
                  set("architecture", {
                    nodes,
                    edges: edges.map((p, j) => (j === i ? [Number(e.target.value), p[1]] : p)) as [number, number][],
                  })
                }
                className="rounded-md border border-soft-2 bg-surface px-2 py-1.5 font-mono text-[11px] text-ink-2"
              >
                {nodes.map((n, k) => (
                  <option key={k} value={k}>
                    {k + 1}. {n.label || "node"}
                  </option>
                ))}
              </select>
              <span className="font-mono text-[11px] text-muted-foreground">→</span>
              <select
                value={b}
                onChange={(e) =>
                  set("architecture", {
                    nodes,
                    edges: edges.map((p, j) => (j === i ? [p[0], Number(e.target.value)] : p)) as [number, number][],
                  })
                }
                className="rounded-md border border-soft-2 bg-surface px-2 py-1.5 font-mono text-[11px] text-ink-2"
              >
                {nodes.map((n, k) => (
                  <option key={k} value={k}>
                    {k + 1}. {n.label || "node"}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => set("architecture", { nodes, edges: edges.filter((_, j) => j !== i) })}
                className="rounded-md border border-soft-2 bg-surface px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-2 hover:border-nova/40 hover:text-nova"
              >
                Remove
              </button>
            </div>
          ))}
          <AddButton
            onClick={() =>
              set("architecture", { nodes, edges: [...edges, [0, Math.min(1, Math.max(0, nodes.length - 1))]] })
            }
            label="Add connection"
          />
        </div>
      </Section>

      <Section title="Architecture images" hint="Shown as tabs — overrides the diagram">
        {value.architecture_images.map((img, i) => (
          <ItemShell
            key={i}
            index={i}
            onRemove={() => set("architecture_images", value.architecture_images.filter((_, j) => j !== i))}
            onUp={() => set("architecture_images", move(value.architecture_images, i, i - 1))}
            onDown={() => set("architecture_images", move(value.architecture_images, i, i + 1))}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AdminInput
                label="Tab name"
                value={img.name ?? ""}
                placeholder="System overview"
                onChange={(v) =>
                  set("architecture_images", value.architecture_images.map((x, j) => (j === i ? { ...x, name: v } : x)))
                }
              />
              <AdminInput
                label="Caption"
                value={img.caption ?? ""}
                onChange={(v) =>
                  set(
                    "architecture_images",
                    value.architecture_images.map((x, j) => (j === i ? { ...x, caption: v } : x)),
                  )
                }
              />
            </div>
            <div className="mt-3">
              <ImageUploader
                bucket="project-images"
                label="Diagram image"
                prefix={`${slugPrefix}-arch-${i + 1}`}
                value={img.url}
                onChange={(u) =>
                  set("architecture_images", value.architecture_images.map((x, j) => (j === i ? { ...x, url: u } : x)))
                }
              />
              <div className="mt-2">
                <AdminInput
                  label="…or paste URL"
                  value={img.url}
                  onChange={(v) =>
                    set("architecture_images", value.architecture_images.map((x, j) => (j === i ? { ...x, url: v } : x)))
                  }
                />
              </div>
            </div>
          </ItemShell>
        ))}
        <AddButton
          onClick={() => set("architecture_images", [...value.architecture_images, { name: "", url: "", caption: "" }])}
          label="Add architecture image"
        />
      </Section>

      <Section title="Feature deep-dives" hint="Each becomes a carousel block">
        {value.features_deep.map((f, i) => (
          <ItemShell
            key={i}
            index={i}
            onRemove={() => set("features_deep", value.features_deep.filter((_, j) => j !== i))}
            onUp={() => set("features_deep", move(value.features_deep, i, i - 1))}
            onDown={() => set("features_deep", move(value.features_deep, i, i + 1))}
          >
            <AdminInput
              label="Title"
              value={f.title}
              onChange={(v) => set("features_deep", value.features_deep.map((x, j) => (j === i ? { ...x, title: v } : x)))}
            />
            <div className="mt-3">
              <AdminTextarea
                label="Description"
                rows={3}
                value={f.description ?? ""}
                onChange={(v) =>
                  set("features_deep", value.features_deep.map((x, j) => (j === i ? { ...x, description: v } : x)))
                }
              />
            </div>
            <div className="mt-3">
              <AdminInput
                label="Video URL (optional)"
                value={f.video_url ?? ""}
                onChange={(v) =>
                  set("features_deep", value.features_deep.map((x, j) => (j === i ? { ...x, video_url: v } : x)))
                }
              />
            </div>
            <div className="mt-3">
              <ImageList
                label="Feature images"
                value={f.images ?? []}
                prefix={`${slugPrefix}-feature-${i + 1}`}
                onChange={(v) =>
                  set("features_deep", value.features_deep.map((x, j) => (j === i ? { ...x, images: v } : x)))
                }
              />
            </div>
          </ItemShell>
        ))}
        <AddButton
          onClick={() => set("features_deep", [...value.features_deep, { title: "", description: "", images: [] }])}
          label="Add feature"
        />
      </Section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {(["frontend_cards", "backend_cards"] as const).map((key) => (
          <Section key={key} title={key === "frontend_cards" ? "Frontend design cards" : "Backend design cards"}>
            {value[key].map((c, i) => (
              <ItemShell
                key={i}
                index={i}
                onRemove={() => set(key, value[key].filter((_, j) => j !== i))}
                onUp={() => set(key, move(value[key], i, i - 1))}
                onDown={() => set(key, move(value[key], i, i + 1))}
              >
                <AdminInput
                  label="Heading"
                  value={c.h}
                  onChange={(v) => set(key, value[key].map((x, j) => (j === i ? { ...x, h: v } : x)))}
                />
                <div className="mt-3">
                  <AdminTextarea
                    label="Body"
                    rows={3}
                    value={c.p}
                    onChange={(v) => set(key, value[key].map((x, j) => (j === i ? { ...x, p: v } : x)))}
                  />
                </div>
              </ItemShell>
            ))}
            <AddButton onClick={() => set(key, [...value[key], { h: "", p: "" }])} label="Add card" />
          </Section>
        ))}
      </div>

      <Section title="Key decision">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <AdminInput
            label="Chose"
            value={value.key_decision.chose ?? ""}
            onChange={(v) => set("key_decision", { ...value.key_decision, chose: v })}
          />
          <AdminInput
            label="Instead of"
            value={value.key_decision.instead_of ?? ""}
            onChange={(v) => set("key_decision", { ...value.key_decision, instead_of: v })}
          />
          <AdminInput
            label="Because"
            value={value.key_decision.because ?? ""}
            onChange={(v) => set("key_decision", { ...value.key_decision, because: v })}
          />
        </div>
      </Section>

      <Section title="What it's built with" hint="Stack groups shown on the detail page">
        {value.stack_groups.map((g, i) => (
          <ItemShell
            key={i}
            index={i}
            onRemove={() => set("stack_groups", value.stack_groups.filter((_, j) => j !== i))}
            onUp={() => set("stack_groups", move(value.stack_groups, i, i - 1))}
            onDown={() => set("stack_groups", move(value.stack_groups, i, i + 1))}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AdminInput
                label="Group name"
                value={g.name}
                placeholder="Frontend"
                onChange={(v) => set("stack_groups", value.stack_groups.map((x, j) => (j === i ? { ...x, name: v } : x)))}
              />
              <AdminInput
                label="Items (comma separated)"
                value={(g.items ?? []).join(", ")}
                placeholder="React, Tailwind, Framer Motion"
                onChange={(v) =>
                  set(
                    "stack_groups",
                    value.stack_groups.map((x, j) =>
                      j === i ? { ...x, items: v.split(",").map((s) => s.trim()).filter(Boolean) } : x,
                    ),
                  )
                }
              />
            </div>
            <div className="mt-3">
              <AdminTextarea
                label="Why this stack"
                rows={2}
                value={g.why ?? ""}
                onChange={(v) => set("stack_groups", value.stack_groups.map((x, j) => (j === i ? { ...x, why: v } : x)))}
              />
            </div>
          </ItemShell>
        ))}
        <AddButton
          onClick={() => set("stack_groups", [...value.stack_groups, { name: "", items: [], why: "" }])}
          label="Add stack group"
        />
      </Section>
    </div>
  );
}
