import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DAYS = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

export default function Setup() {
  const navigate = useNavigate();

  const [moduleInput, setModuleInput] = useState("");
  const [modules, setModules] = useState([]);
  const [moduleError, setModuleError] = useState("");

  const [availability, setAvailability] = useState(
    Object.fromEntries(DAYS.map(d => [d, 0]))
  );

  {/* Compute total hours */}
  const totalHours = Object.values(availability).reduce(
    (sum, h) => sum + (Number(h) || 0),
    0
  );

  function handleAvailabilityChange(day, value){
    setAvailability(prev => ({
      ...prev,
      [day]: Math.max(0, Number(value)), // Prevent Negative Numbers
    }));
  }

  function addModule(){
    const cleaned = moduleInput.trim();
    // clear old error
    setModuleError("");

    if (!cleaned) return;

    // prevent duplicates
    const exists = modules.some(
      (m) => m.toLowerCase() === cleaned.toLowerCase()
    );

    if (exists){
      setModuleError(`${cleaned} already added`);
      return;
    }

    setModules((prev) => [...prev, cleaned]);
    setModuleInput("");
  }

  function removeModule(name){
    setModules((prev) => prev.filter((m) => m !== name));
  }

  function handleSubmit(e){
    e.preventDefault();

    if (modules.length === 0){
      alert("Please enter at least one module");
      return;
    }

    const totalHours = Object.values(availability).reduce((a, b) => a + b, 0);
    if (totalHours === 0){
      alert("Please enter your available study time");
      return;
    }

    // Save
    localStorage.setItem("modules", JSON.stringify(modules));
    localStorage.setItem("availability", JSON.stringify(availability));

    navigate("/dashboard");
  }

  return(
    <div style={{ padding: 40, maxWidth: 600 }}>
      <h1>StudyPulse Setup</h1>
      <p>Tell us what you're studying and when you're free.</p>

      <form onSubmit={handleSubmit}>
        <h3>Modules</h3>

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            type="text"
            placeholder="Type a module and press Enter"
            value={moduleInput}
            onChange={e => setModuleInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addModule();
              }
            }}
            style={{ flex: 1, padding: 8 }}
          />

          <button type="button" onClick={addModule}>
            Add
          </button>
        </div>

        {moduleError && <p style={{ color: "crimson" }}>{moduleError}</p>}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {modules.map((m) => (
            <span
              key={m}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 999,
                background: "#eee",
              }}
            >
              {m}
              <button
                type="button"
                onClick={() => removeModule(m)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                aria-label={`Remove ${m}`}
              >
                x
              </button>
            </span>
          ))}
        </div>

        <h3>Weekly availability (hours per day)</h3>
        {DAYS.map(day => (
          <div key={day} style={{ marginBottom: 8 }}>
            {day}:{" "}
            <input
              type="number"
              min="0"
              value={availability[day]}
              onChange={e => handleAvailabilityChange(day, e.target.value)}
            />
          </div>
        ))}

        <p>
          Total weekly study capacity: <b>{totalHours}</b> hrs
        </p>

        <button style={{ marginTop: 20 }}>Continue</button>
      </form>
    </div>
  );
}