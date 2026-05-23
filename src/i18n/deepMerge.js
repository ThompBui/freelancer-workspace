/** Deep-merge locale overrides onto English base (fallback for missing keys). */
export function deepMerge(base, override) {
  if (!override || typeof override !== 'object') return base;
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const key of Object.keys(override)) {
    const b = base?.[key];
    const o = override[key];
    if (o && typeof o === 'object' && !Array.isArray(o) && typeof b === 'object' && b && !Array.isArray(b)) {
      out[key] = deepMerge(b, o);
    } else {
      out[key] = o;
    }
  }
  return out;
}
