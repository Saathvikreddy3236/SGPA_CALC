import { useMemo, useState } from 'react'
import './App.css'

const gradeScale = [
  { label: 'Excellent', points: 10 },
  { label: 'A', points: 9 },
  { label: 'B', points: 8 },
  { label: 'C', points: 7 },
  { label: 'D', points: 6 },
  { label: 'P', points: 5 },
  { label: 'M', points: 4 },
  { label: 'F', points: 0 },
]

const defaultRow = (id) => ({
  id,
  subject: '',
  credits: 3,
  grade: 'A',
})

function App() {
  const [rows, setRows] = useState([])
  const [nextId, setNextId] = useState(1)
  const [subjectCountInput, setSubjectCountInput] = useState('')

  const totals = useMemo(() => {
    const attemptedCredits = rows.reduce((sum, row) => sum + Number(row.credits || 0), 0)

    const totalCredits = rows.reduce((sum, row) => {
      if (row.grade === 'F') {
        return sum
      }

      return sum + Number(row.credits || 0)
    }, 0)

    const totalPoints = rows.reduce((sum, row) => {
      const grade = gradeScale.find((entry) => entry.label === row.grade)
      return sum + Number(row.credits || 0) * (grade?.points ?? 0)
    }, 0)

    const sgpa = attemptedCredits > 0 ? totalPoints / attemptedCredits : 0

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
    setRows([])
    setNextId(1)
    setSubjectCountInput('')
  }

  const generateSubjects = () => {
    const count = Number(subjectCountInput)

    if (!Number.isInteger(count) || count < 1) {
      return
    }

    const newRows = Array.from({ length: count }, (_, index) => defaultRow(index + 1))
    setRows(newRows)
    setNextId(count + 1)
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

        <div className="subject-count-control">
          <input
            type="number"
            min="1"
            step="1"
            value={subjectCountInput}
            placeholder="Enter no. of subjects"
            onChange={(event) => setSubjectCountInput(event.target.value)}
          />
          <button type="button" className="ghost" onClick={generateSubjects}>
            Create Subjects
          </button>
        </div>

        {rows.length === 0 ? (
          <p className="empty-state">Enter no. of subjects and click "Create Subjects" to continue.</p>
        ) : (
          <>
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
                          max="5"
                          step="1"
                          value={row.credits}
                          onChange={(event) =>
                            updateRow(
                              row.id,
                              'credits',
                              Math.min(5, Math.max(0, Number(event.target.value || 0))),
                            )
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
          </>
        )}

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

