// Verified proof metrics only. A metric without a value does not render;
// if none has a value, the whole proof strip is hidden. Never invent values.

export type ProofMetric = {
  label: string;
  value: string;
  /** Where the number comes from, e.g. a PageSpeed report URL and date. */
  source: string;
};

// TODO(owner): supply real values and sources (PRD Open Decision #4).
export const proof: ProofMetric[] = [
  { label: "Mobile load time", value: "", source: "" },
  { label: "Bookings handled automatically", value: "", source: "" },
];

export const verifiedProof = proof.filter((m) => m.value.trim() !== "");
