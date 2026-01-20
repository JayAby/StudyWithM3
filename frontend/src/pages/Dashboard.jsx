/* eslint-disable react-hooks/preserve-manual-memoization */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { card, miniCard, btn, chip } from "../styles/ui";

const DAY_KEYS = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

// System recommended hours
const DEFAULT_HOURS_BY_TYPE = {
    Coursework: 10,
    Report: 12,
    Exam: 8,
    Presentation: 6,
    Quiz: 3,
};

export default function Dashboard() {
    const navigate = useNavigate();

    const modules = JSON.parse(localStorage.getItem("modules") || "[]");
    const availability = JSON.parse(localStorage.getItem("availability") || "{}");
    const assessments = JSON.parse(localStorage.getItem("assessments") || "[]");

    // choose how far ahead to display deadlines
    const [windowDays, setWindowDays] = useState(14);

    // helpers
    const todayKey = DAY_KEYS[new Date().getDay()];
    const todayCapacity = Number(availability[todayKey] || 0);

    // compute total weekly availability
    const totalWeeklyHours = useMemo(() => {
        return Object.values(availability).reduce((sum, h) => sum + (Number(h) || 0), 0);
    }, [availability]);
    
    // compute upcoming deadlines within windowDays
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    const upcoming = useMemo(() => {
        const today = new Date();     // Get current date/time
        today.setHours(0, 0, 0, 0);    // set time to midnight

        const end = new Date(today);
        end.setDate(end.getDate() + windowDays);

        const todayTs = today.getTime();
        const endTs = end.getTime();

        //  Filter, map, and sort assessments
        return assessments
            .filter((a) => a.dueDate)         // ensure dueDate exists
            .map((a) => ({ ...a, dueTs: new Date(a.dueDate).getTime() }))       // convert dueDate string → timestamp
            .filter((a) => a.dueTs >= todayTs && a.dueTs <= endTs)         // keep only dates within a month
            .sort((a, b) => a.dueTs - b.dueTs);    // sort soonest first
    }, [assessments, windowDays]);
    
    // Today's workload: 3 nearest upcoming assessments
    const todayWorkload = useMemo(() => {
        if (todayCapacity <= 0) return [];

        // Take nearest 3 deadlines
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const end = new Date(today);
        end.setDate(end.getDate() + 30);

        const dueSoon = assessments
            .filter((a) => a.dueDate)
            .map((a) => ({ ...a, dueTs: new Date(a.dueDate).getTime() }))
            .filter((a) => a.dueTs >= today.getTime() && a.dueTs <= end.getTime())
            .sort((a, b) => a.dueTs - b.dueTs)
            .slice(0, 3);

        if (dueSoon.length === 0) return [];

        // 
        const withEst = dueSoon.map((a) => {
            const fallback = DEFAULT_HOURS_BY_TYPE[a.type] ?? 8;
            const est = a.estHours == null ? fallback : Number(a.estHours);
            return { ...a, estHoursResolved: Math.max(1, est) };
        });

        const totalEst = withEst.reduce((sum, a) => sum + a.estHoursResolved, 0);

        // allocate todayCapacity across 3 items
        return withEst.map((a) => {
            const share = totalEst === 0 ? todayCapacity / withEst.length : (a.estHoursResolved / totalEst) * todayCapacity;
            // round to nearest 0.5 hr
            const suggestedHours = Math.max(0.5, Math.round(share * 2) / 2);
            return { ...a, suggestedHours };
        });
    }, [assessments, todayCapacity]);

    const nextDeadline = upcoming[0];

    return(
        <div style={{ padding: 40, maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap:12 }}>
            <h1 style={{ margin: 0 }}>Dashboard</h1>
            <button style={btn} onClick={() => navigate("/assessments")}>
                Go to Assessments
            </button>
        </div>

        {/* Top summary row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap:12, marginTop: 16}}>
            <div style={card}>
                <div style={muted}>Weekly study capacity</div>
                <div style={big}>{totalWeeklyHours} hrs</div>
            </div>

            <div style={card}>
                <div style={muted}>Assessments saved</div>
                <div style={big}>{assessments.length}</div>
            </div>

            <div style={card}>
                <div style={muted}>Next deadline</div>
                {nextDeadline ? (
                    <div>
                        <div style={{ fontWeight: 700 }}>{nextDeadline.title}</div>
                        <div style={mutedSmall}>
                            {nextDeadline.moduleName} ● {nextDeadline.type} ● due {nextDeadline.dueDate}
                        </div>
                    </div>
                ) : (
                    <div style={mutedSmall}>No upcoming deadlines</div>
                )}
                </div>
            </div>

            {/* Main grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 12, marginTop: 12 }}>
                {/* Left column */}
                <div style={{ display: "grid", gap: 12 }}>
                    <div style={card}>
                        <h3 style={h3}>Today's workload</h3>
                        <div style={mutedSmall}>
                            Today: <b>{todayKey}</b>. Study-hours: <b>{todayCapacity} hrs</b>
                        </div>

                        {todayCapacity <= 0 ? (
                            <p style={{ marginTop: 10 }}>No study time set for today. Update your availability in setup.</p>
                        ) : todayWorkload.length === 0 ? (
                            <p style={{ marginTop: 10 }}>No deadlines in the next 30 days.</p>
                        ) : (
                            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                                {todayWorkload.map((a) => (
                                    <div key={a.id} style={miniCard}>
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                                            <div>
                                                <div style={{ fontWeight: 700 }}>{a.title}</div>
                                                <div style={mutedSmall}>
                                                    {a.moduleName} ● {a.type} ● due {a.dueDate}
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 800 }}>{a.suggestedHours}h</div>
                                        </div>
                                    </div>               
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={card}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                            <h3 style={h3}>Upcoming deadlines</h3>

                            <div style={{ display: "flex", gap: 8 }}>
                                <button style={chip(windowDays === 7)} onClick={() => setWindowDays(7)}>7d</button>
                                <button style={chip(windowDays === 14)} onClick={() => setWindowDays(14)}>14d</button>
                                <button style={chip(windowDays === 30)} onClick={() => setWindowDays(30)}>30d</button>
                            </div>
                        </div>

                        {upcoming.length === 0 ? (
                            <p>No deadlines in the next {windowDays} days.</p>
                        ) : (
                            <div style={{ display: "grid", gap: 10 }}>
                                {upcoming.map((a) => (
                                    <div key={a.id} style={miniCard}>
                                        <div style={{ fontWeight: 700 }}>{a.title}</div>
                                        <div style={mutedSmall}>
                                            {a.moduleName} ● {a.type} ●  due {a.dueDate}
                                            {a.estHours != null ? <span> ● est {a.estHours}h</span> : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right column */}
                <div style={{ display: "grid", gap: 12 }}>
                    <div style={card}>
                        <h3 style={h3}>Your modules</h3>
                        {modules.length === 0 ? (
                            <p>No modules added yet.</p>
                        ) : (
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                {modules.map((m, i) => (
                                    <li key={i}>{m}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div style={card}>
                        <h3 style={h3}>Weekly availability</h3>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {Object.entries(availability).map(([day, hours]) => (
                                <li key={day}>
                                    {day} : {hours} hrs
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <p style={{ marginTop: 18}}>
                Next: add <b>brief upload</b>
            </p>
        </div>
    );
}


const h3 = { margin: 0, marginBottom: 10 };

const muted = { color: "#555", fontSize: 13 };
const mutedSmall = { color: "#666", fontSize: 12, marginTop: 4 };
const big = { fontSize: 26, fontWeight: 800, marginTop: 6 };