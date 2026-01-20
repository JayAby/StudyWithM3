import { card, dangerBtn } from "../styles/ui";

export default function AssessmentItem({ assessment, onDelete }) {
    return(
        <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                    <b>{assessment.title}</b>
                    <div style={{ color: "#555", marginTop: 4 }}>
                        {assessment.moduleName} ● {assessment.type}
                    </div>
                    <div style={{ marginTop: 6 }}>
                        Due: <b>{assessment.dueDate}</b>
                        {assessment.estHours != null ? (
                            <span style={{ marginLeft: 10 }}>· Est: <b>{assessment.estHours}h</b></span>
                        ) : null}
                    </div>
                </div>

                <button onClick={() => onDelete(assessment.id)} style={dangerBtn}>
                    Delete
                </button>
            </div>
        </div>
    )
}

