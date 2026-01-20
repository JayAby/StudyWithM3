import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssessmentItem from "../components/AssessmentItem";
import { card, row, rowFull, label, input, btn, primaryBtn } from "../styles/ui";

const TYPES = ["Coursework", "Report", "Exam", "Presentation", "Quiz"];

export default function Assessments(){
    const navigate = useNavigate();

    const modules = JSON.parse(localStorage.getItem("modules") || "[]");

    const [moduleName, setModuleName] = useState(modules[0] || "");
    const [title, setTitle] = useState("");
    const [type, setType] = useState("Coursework");
    const [dueDate, setDueDate] = useState("");
    const [estHours, setEstHours] = useState("");
    const [briefFile, setBriefFile] = useState(null);
    const [briefPreview, setBriefPreview] = useState("");

    const [assessments, setAssessments] = useState(() => {
        return JSON.parse(localStorage.getItem("assessments") || "[]");
    });

    const sortedAssessments = useMemo(() => {
        return [...assessments].sort((a, b) => {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
    }, [assessments]);

    function saveToStorage(next){
        localStorage.setItem("assessments", JSON.stringify(next));
    }

    function handleAdd(e) {
        e.preventDefault();

        if (!moduleName) return alert("No modules found. Please complete setup.");
        if (!title.trim()) return alert("Enter an assessment title.");
        if (!dueDate) return alert("Select a due date.");
        if (!type) return alert("Select assessment type.");

        const hoursNum = estHours === "" ? null : Math.max(0, Number(estHours) || 0);

        const newItem = {
            id: crypto.randomUUID(),
            moduleName,
            title: title.trim(),
            type,
            dueDate,
            estHours: hoursNum,
            createdAt: new Date().toISOString(),
        };

        const next = [...assessments, newItem];
        setAssessments(next);
        saveToStorage(next);

        // reset small fields
        setTitle("");
        setDueDate("");
        setEstHours("");
        setType(TYPES[0]);
    }

    function handleDelete(id) {
        const next = assessments.filter((a) => a.id !== id);
        setAssessments(next);
        saveToStorage(next);
    }

    function handleBriefChange(e){
        const file = e.target.files?.[0] || null;
        setBriefFile(file);
        setBriefPreview(file ? file.name : "");
    }

    return (
        <div style={{ padding: 40, maxWidth: 820 }}>
            <h1>Assessments</h1>
            <p>Add your assessments and deadlines.</p>

            <div style={{ marginBottom: 16 }}>
                <button onClick={() => navigate("/dashboard")} style={btn}>
                    Return to Dashboard.
                </button>
            </div>

            <form onSubmit={handleAdd} style={card}>
                <h3 style={{ marginTop: 0 }}>Add an assessment</h3>

                <div style={row}>
                    <label style={label}>
                        Module
                        <select
                            value={moduleName}
                            onChange={(e) => setModuleName(e.target.value)}
                            style={input}
                            disabled={modules.length === 0}
                        >
                            {modules.length === 0 ? (
                                <option>No modules found</option>
                            ) : (
                                modules.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))
                            )}
                        </select>
                    </label>

                    <label style={label}>
                        Type
                        <select value={type} onChange={(e) => setType(e.target.value)} style={input}>
                            <option value="Coursework">Coursework</option>
                            <option value="Exam">Exam</option>
                            <option value="Presentation">Presentation</option>
                            <option value="Lab report / Project">Lab report / Project</option>
                        </select>
                    </label>
                </div>

                <div style={rowFull}>
                    <label style={label}>
                        Title
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., AI Coursework 2"
                            style={input}
                        />
                    </label>

                    <label style={label}>
                        Module Brief Upload (Optional)
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleBriefChange} />
                        {briefPreview ? (
                            <small>Selected: {briefPreview}</small>
                        ) : (
                            <small>No file selected</small>
                        )}

                    </label>
                </div>

                <div style={row}>
                    <label style={label}>
                        Due date
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            style={input}
                        />
                    </label>

                    <label style={label}>
                        Estimated hours (optional)
                        <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={estHours}
                            onChange={(e) => setEstHours(e.target.value)}
                            placeholder="e.g., 10"
                            style={input}
                        />
                    </label>
                </div>

                <button type="submit" style={primaryBtn}>
                    Add assessment
                </button>
            </form>

            <div style={{ marginTop: 20 }}>
                <h3>Your assessments</h3>

                {sortedAssessments.length === 0 ? (
                    <p>No assessments yet.</p>
                ) : (
                    <div style={{ display: "grid", gap: 12 }}>
                        {sortedAssessments.map((a) =>(
                            <AssessmentItem
                                key = {a.id}
                                assessment={a}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginTop: 24 }}>
                <p>
                    Next: we generate a study plan from <b>availability + assessments</b>.
                </p>
            </div>
        </div>
    );
}