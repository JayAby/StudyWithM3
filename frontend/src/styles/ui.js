//  Generic card container
export const card = {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 16,
    background: "white",
};

// Smaller card variant
export const miniCard = {
    border: "1px solid #eee",
    borderRadius: 8,
    padding: 12,
    background: "#fafafa",
};

// Default button
export const btn = {
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #bbb",
  background: "#f2f2f2",
  cursor: "pointer",
};

// Primary action button
export const primaryBtn = {
  padding: "10px 12px",
  borderRadius: 6,
  border: "none",
  background: "#04AA6D",
  color: "white",
  cursor: "pointer",
};

// Destructive action button
export const dangerBtn = {
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #d33",
  background: "#fff5f5",
  color: "#b00000",
  cursor: "pointer",
};

// Common input field style
export const input = {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #bbb",
    outline: "none",
};

// Label wrapper for form fields
export const label = {
    display: "grid",
    gap: 6,
    fontSize: 14
};

// Two-column row (forms)
export const row = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 12,
};

// Full-width row
export const rowFull = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 12,
    marginBottom: 12,
};

// Small badge/chip style
export const chip = (active) => ({
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #bbb",
    background: active ? "#111" : "#f2f2f2",
    color: active ? "white" : "black",
    cursor: "pointer",
});