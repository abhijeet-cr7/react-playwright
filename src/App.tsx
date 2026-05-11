import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

type Todo = {
  id: number
  text: string
  completed: boolean
}

const AUTH_STORAGE_KEY = 'todo-authenticated'
const TODOS_STORAGE_KEY = 'todo-items'
const VALID_USERNAME = 'demo'
const VALID_PASSWORD = 'password123'

const loadTodos = (): Todo[] => {
  const raw = localStorage.getItem(TODOS_STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as Todo[]
    return parsed.filter((todo) => typeof todo.id === 'number' && typeof todo.text === 'string')
  } catch {
    return []
  }
}

type LoginProps = {
  isAuthenticated: boolean
  onLogin: () => void
}

function LoginPage({ isAuthenticated, onLogin }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/todos" replace />
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (username.trim() === VALID_USERNAME && password === VALID_PASSWORD) {
      onLogin()
      return
    }

    setError('Invalid credentials. Use demo / password123.')
  }

  return (
    <main className="container">
      <section className="card" data-testid="login-screen">
        <h1>Todo Login</h1>
        <p className="hint">Use demo / password123 to sign in.</p>
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            data-testid="username-input"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value)
              setError('')
            }}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            data-testid="password-input"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError('')
            }}
          />

          {error ? (
            <p className="error" data-testid="login-error">
              {error}
            </p>
          ) : null}

          <button type="submit" data-testid="login-button">
            Login
          </button>
        </form>
      </section>
    </main>
  )
}

type TodoProps = {
  todos: Todo[]
  onAdd: (text: string) => void
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onLogout: () => void
}

function TodoPage({ todos, onAdd, onToggle, onDelete, onLogout }: TodoProps) {
  const [newTodo, setNewTodo] = useState('')

  const completedCount = useMemo(() => todos.filter((todo) => todo.completed).length, [todos])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = newTodo.trim()

    if (!trimmed) {
      return
    }

    onAdd(trimmed)
    setNewTodo('')
  }

  return (
    <main className="container" data-testid="todo-screen">
      <section className="card">
        <header className="header">
          <div>
            <h1>Todo List</h1>
            <p className="hint" data-testid="todo-summary">
              {completedCount}/{todos.length} completed
            </p>
          </div>
          <button type="button" className="secondary" onClick={onLogout} data-testid="logout-button">
            Logout
          </button>
        </header>

        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            data-testid="new-todo-input"
            placeholder="Add a todo"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
          />
          <button type="submit" data-testid="add-todo-button" disabled={!newTodo.trim()}>
            Add
          </button>
        </form>

        <ul className="todo-list" data-testid="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item" data-testid={`todo-item-${todo.id}`}>
              <label>
                <input
                  type="checkbox"
                  data-testid={`toggle-todo-${todo.id}`}
                  checked={todo.completed}
                  onChange={() => onToggle(todo.id)}
                />
                <span className={todo.completed ? 'done' : ''}>{todo.text}</span>
              </label>
              <button
                type="button"
                className="danger"
                data-testid={`delete-todo-${todo.id}`}
                onClick={() => onDelete(todo.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem(AUTH_STORAGE_KEY) === 'true')
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos())

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated))
  }, [isAuthenticated])

  useEffect(() => {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const nextId = useMemo(() => (todos.length ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1), [todos])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage isAuthenticated={isAuthenticated} onLogin={() => setIsAuthenticated(true)} />} />
      <Route
        path="/todos"
        element={
          isAuthenticated ? (
            <TodoPage
              todos={todos}
              onAdd={(text) => setTodos((previous) => [...previous, { id: nextId, text, completed: false }])}
              onToggle={(id) =>
                setTodos((previous) =>
                  previous.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
                )
              }
              onDelete={(id) => setTodos((previous) => previous.filter((todo) => todo.id !== id))}
              onLogout={() => setIsAuthenticated(false)}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/todos' : '/login'} replace />} />
    </Routes>
  )
}

export default App
