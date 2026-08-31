import { useMemo, useState } from 'react'
import './App.css'

const gradeScale = [
  { points: 10, grade: 'Ex', label: '10 Points (Grade Ex - Excellent)' },
  { points: 9, grade: 'A', label: '9 Points (Grade A)' },
  { points: 8, grade: 'B', label: '8 Points (Grade B)' },
  { points: 7, grade: 'C', label: '7 Points (Grade C)' },
  { points: 6, grade: 'D', label: '6 Points (Grade D)' },
  { points: 5, grade: 'P', label: '5 Points (Grade P - Pass)' },
  { points: 4, grade: 'M', label: '4 Points (Grade M - Marginal)' },
  { points: 0, grade: 'F', label: '0 Points (Grade F - Fail)' },
]

const defaultRow = (id) => ({
  id,
  subject: '',
  credits: 3,
  points: 9,
})

const defaultSemRow = (id) => ({
  id,
  semester: `Semester ${id}`,
  credits: 20,
  sgpa: 8.0,
})

const getInitialRows = (mode) => {
  return Array.from({ length: 5 }, (_, i) =>
    mode === 'sgpa' ? defaultRow(i + 1) : defaultSemRow(i + 1)
  )
}

function App() {
  const [mode, setMode] = useState('sgpa')
  const [rows, setRows] = useState(() => getInitialRows('sgpa'))
  const [nextId, setNextId] = useState(6)

  const totals = useMemo(() => {
    if (mode === 'cgpa') {
      const attemptedCredits = rows.reduce((sum, row) => sum + Number(row.credits || 0), 0)
      const totalPoints = rows.reduce(
        (sum, row) => sum + Number(row.credits || 0) * Number(row.sgpa || 0),
        0
      )
      const cgpa = attemptedCredits > 0 ? totalPoints / attemptedCredits : 0

      return {
        totalCredits: attemptedCredits,
        totalPoints,
        gpa: cgpa,
      }
    }

    const attemptedCredits = rows.reduce((sum, row) => sum + Number(row.credits || 0), 0)

    const totalPoints = rows.reduce((sum, row) => {
      return sum + Number(row.credits || 0) * Number(row.points ?? 0)
    }, 0)

    const sgpa = attemptedCredits > 0 ? totalPoints / attemptedCredits : 0

    return { totalCredits: attemptedCredits, totalPoints, gpa: sgpa }
  }, [rows, mode])

  const updateRow = (id, field, value) => {
    setRows((currentRows) =>
      currentRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    )
  }

  const addRow = () => {
    setRows((currentRows) => [
      ...currentRows,
      mode === 'sgpa' ? defaultRow(nextId) : defaultSemRow(nextId),
    ])
    setNextId((currentId) => currentId + 1)
  }

  const removeRow = (id) => {
    setRows((currentRows) => currentRows.filter((row) => row.id !== id))
  }

  const resetAll = () => {
    setRows([])
    setNextId(1)
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setRows(getInitialRows(nextMode))
    setNextId(6)
  }

  return (
    <main className="page-wrapper">
      <div className="card-container">
        {/* Header */}
        <header className="app-header">
          <div className="badge">🎓 Academic Calculator</div>
          <h1>{mode === 'sgpa' ? 'SGPA Calculator' : 'CGPA Calculator'}</h1>
          <p className="subtitle">
            {mode === 'sgpa'
              ? 'Enter course credits (1-10) and grade points to calculate your semester GPA instantly.'
              : 'Enter semester credits and SGPA scores to calculate your cumulative CGPA.'}
          </p>
        </header>

        {/* Mode Selector */}
        <div className="mode-toggle">
          <button
            type="button"
            className={`toggle-btn ${mode === 'sgpa' ? 'active' : ''}`}
            onClick={() => switchMode('sgpa')}
          >
            📘 SGPA Mode
          </button>
          <button
            type="button"
            className={`toggle-btn ${mode === 'cgpa' ? 'active' : ''}`}
            onClick={() => switchMode('cgpa')}
          >
            📊 CGPA Mode
          </button>
        </div>

        {/* Table / Form Rows */}
        {rows.length === 0 ? (
          <div className="empty-box">
            <p>No entries added. Click below to add your first entry.</p>
            <button type="button" className="btn btn-primary" onClick={addRow}>
              {mode === 'sgpa' ? '+ Add Subject' : '+ Add Semester'}
            </button>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="calc-table">
                <thead>
                  <tr>
                    <th>{mode === 'sgpa' ? 'Subject Name (Optional)' : 'Semester'}</th>
                    <th>Credits (1-10)</th>
                    <th>{mode === 'sgpa' ? 'Grade Points (0-10)' : 'SGPA'}</th>
                    <th style={{ textAlign: 'center' }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id}>
                      <td className="cell-subject">
                        <span className="mobile-label">
                          {mode === 'sgpa' ? `Subject #${index + 1}` : `Semester #${index + 1}`}
                        </span>
                        {mode === 'sgpa' ? (
                          <input
                            type="text"
                            className="input-field"
                            value={row.subject}
                            onChange={(e) => updateRow(row.id, 'subject', e.target.value)}
                            placeholder={`Subject ${index + 1}`}
                          />
                        ) : (
                          <input
                            type="text"
                            className="input-field"
                            value={row.semester}
                            onChange={(e) => updateRow(row.id, 'semester', e.target.value)}
                            placeholder={`Semester ${index + 1}`}
                          />
                        )}
                      </td>
                      <td className="cell-credits">
                        <span className="mobile-label">Credits (1-10)</span>
                        <input
                          type="number"
                          className="input-field number-input"
                          min="1"
                          max="10"
                          step="1"
                          value={row.credits}
                          onChange={(e) => updateRow(row.id, 'credits', e.target.value)}
                        />
                      </td>
                      <td className="cell-grade">
                        <span className="mobile-label">
                          {mode === 'sgpa' ? 'Grade Points' : 'SGPA'}
                        </span>
                        {mode === 'sgpa' ? (
                          <select
                            className="select-field"
                            value={row.points}
                            onChange={(e) => updateRow(row.id, 'points', Number(e.target.value))}
                          >
                            {gradeScale.map((item) => (
                              <option key={item.points} value={item.points}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="number"
                            className="input-field number-input"
                            min="0"
                            max="10"
                            step="0.0001"
                            value={row.sgpa}
                            onChange={(e) => updateRow(row.id, 'sgpa', e.target.value)}
                          />
                        )}
                      </td>
                      <td className="cell-action">
                        <button
                          type="button"
                          className="btn-danger"
                          onClick={() => removeRow(row.id)}
                          title="Remove entry"
                        >
                          ✕ Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="action-buttons">
              <button type="button" className="btn btn-primary" onClick={addRow}>
                {mode === 'sgpa' ? '+ Add Subject' : '+ Add Semester'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetAll}>
                Reset All
              </button>
            </div>
          </>
        )}

        {/* Results Section */}
        <section className="results-card">
          <div className="result-item">
            <span className="result-label">Total Credits</span>
            <strong className="result-value">{totals.totalCredits}</strong>
          </div>
          <div className="result-item">
            <span className="result-label">
              {mode === 'sgpa' ? 'Grade Points' : 'Weighted Points'}
            </span>
            <strong className="result-value">{totals.totalPoints.toFixed(4)}</strong>
          </div>
          <div className="result-item score-highlight">
            <span className="result-label">{mode === 'sgpa' ? 'SGPA' : 'CGPA'}</span>
            <strong className="result-score">{totals.gpa.toFixed(4)}</strong>
          </div>
        </section>

        {/* Separate Reference Section Explaining Grades and Points */}
        <section className="reference-section">
          <h3 className="reference-title">📖 Grade & Points Reference Chart</h3>
          <div className="reference-grid">
            {gradeScale.map((item) => (
              <div key={item.points} className="reference-card">
                <span className="ref-points">{item.points} Grade Points</span>
                <span className="ref-grade">Grade Letter: {item.grade}</span>
                <span className="ref-desc">
                  {item.points === 10
                    ? 'Ex (Excellent) or S or O'
                    : item.points === 9
                      ? 'A (Very Good)'
                      : item.points === 8
                        ? 'B (Good)'
                        : item.points === 7
                          ? 'C (Above Average)'
                          : item.points === 6
                            ? 'D (Average)'
                            : item.points === 5
                              ? 'P (Pass)'
                              : item.points === 4
                                ? 'M (Marginal Pass)'
                                : 'F (Fail)'}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
