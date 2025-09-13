import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:3005/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addOrUpdateTask = async () => {
    try {
      setLoading(true);
      setError("");
      if (editId) {
        await axios.put(
          `http://localhost:3005/api/tasks/${editId}`,
          { text },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditId(null);
      } else {
        await axios.post(
          "http://localhost:3005/api/tasks",
          { text },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setText("");
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving task");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setLoading(true);
      setError("");
      await axios.delete(`http://localhost:3005/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting task");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (task) => {
    setText(task.text);
    setEditId(task._id);
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div>
      <h2>Dashboard</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>⏳ Loading...</p>}

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New Task"
        disabled={loading}
      />
      <button onClick={addOrUpdateTask} disabled={loading}>
        {editId ? "Update Task" : "Add Task"}
      </button>

      <ul>
        {tasks.map((t) => (
          <li key={t._id}>
            {t.text}{" "}
            <button onClick={() => startEdit(t)} disabled={loading}>
              ✏️ Edit
            </button>
            <button onClick={() => deleteTask(t._id)} disabled={loading}>
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
