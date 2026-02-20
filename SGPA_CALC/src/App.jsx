import { useMemo, useState } from 'react'
import './App.css'

const gradeScale = [
  { label: 'O', points: 10 },
  { label: 'A+', points: 9 },
  { label: 'A', points: 8 },
  { label: 'B+', points: 7 },
  { label: 'B', points: 6 },
  { label: 'C', points: 5 },
  { label: 'P', points: 4 },
  { label: 'F', points: 0 },
]

const defaultRow = (id) => ({
  id,
  subject: '',
  credits: 3,
  grade: 'A',
})

function App() {
  const [rows, setRows] = useState([defaultRow(1), defaultRow(2), defaultRow(3)])
  const [nextId, setNextId] = useState(4)

  const totals = useMemo(() => {
    const totalCredits = rows.reduce((sum, row) => sum + Number(row.credits || 0), 0)
    const totalPoints = rows.reduce((sum, row) => {
      const grade = gradeScale.find((entry) => entry.label === row.grade)
      return sum + Number(row.credits || 0) * (grade?.points ?? 0)
    }, 0)

    const sgpa = totalCredits > 0 ? totalPoints / totalCredits : 0

    return { totalCredits, totalPoints, sgpa }
  }, [rows])

  const updateRow = (id, field, value) => {
    setRows((currentRows) =>
      currentRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    )
  }

  const addRow = () => {
    setRows((currentRows) => [...currentRows, defaultRow(nextId)])
    setNextId((currentId) => currentId + 1)
  }

  const removeRow = (id) => {
    setRows((currentRows) => currentRows.filter((row) => row.id !== id))
  }

  const resetAll = () => {
    setRows([defaultRow(1), defaultRow(2), defaultRow(3)])
    setNextId(4)
  }

  return (
    <main className="page">
      <section className="calculator-card">
        <header className="hero">
          <p className="kicker">Academic Toolkit</p>
          <h1>SGPA Calculator</h1>
          <p className="subtitle">
            Subject names are optional. Enter credits and grades to get your semester GPA instantly.
          </p>
        </header>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Subject (Optional)</th>
                <th>Credits</th>
                <th>Grade</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="text"
                      value={row.subject}
                      onChange={(event) => updateRow(row.id, 'subject', event.target.value)}
                      placeholder={`Subject ${index + 1} (Optional)`}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={row.credits}
                      onChange={(event) =>
                        updateRow(row.id, 'credits', Math.max(0, Number(event.target.value || 0)))
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={row.grade}
                      onChange={(event) => updateRow(row.id, 'grade', event.target.value)}
                    >
                      {gradeScale.map((grade) => (
                        <option key={grade.label} value={grade.label}>
                          {grade.label} ({grade.points})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="ghost danger"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length === 1}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="actions">
          <button type="button" className="ghost" onClick={addRow}>
            + Add Subject
          </button>
          <button type="button" className="ghost" onClick={resetAll}>
            Reset
          </button>
        </div>

        <section className="result">
          <div>
            <p>Total Credits</p>
            <strong>{totals.totalCredits}</strong>
          </div>
          <div>
            <p>Total Grade Points</p>
            <strong>{totals.totalPoints.toFixed(2)}</strong>
          </div>
          <div>
            <p>SGPA</p>
            <strong>{totals.sgpa.toFixed(2)}</strong>
          </div>
        </section>
      </section>
    </main>
  )
}

export default App

