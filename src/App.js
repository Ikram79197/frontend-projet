import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { PlusCircleOutlined, ReloadOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import TaskDetail from "./components/TaskDetail";
import TaskEditForm from "./components/TaskEditForm";
import Register from "./components/Register";
import Login from "./components/Login";
import { taskService } from "./services/api"; 
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(""); // Add a state for the username
  const [view, setView] = useState("login");
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (token) {
      setIsAuthenticated(true);
      setUsername(storedUsername || "Utilisateur");
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await taskService.getAllTasks(); 
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches :", error);
    }
  };

  const handleLoginSuccess = (username) => {
    localStorage.setItem("username", username); // Store the username in localStorage
    setUsername(username); // Update the username state
    setIsAuthenticated(true);
    setView("list");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username"); // Clear the username from localStorage
    setIsAuthenticated(false);
    setUsername(""); // Reset the username state
    setView("login");
  };

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]); // Ajoute la nouvelle tâche à la liste
    setIsModalVisible(false);
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    ); // Met à jour la tâche dans la liste
    setView("list");
  };

  const handleViewTask = (taskId) => {
    setSelectedTaskId(taskId);
    setView("detail");
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setView("edit");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedTask(null);
    setSelectedTaskId(null);
  };

  const renderView = () => {
    if (!isAuthenticated) {
      // Affiche Login ou Register si non authentifié
      return view === "login" ? (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setView("register")}
        />
      ) : (
        <Register onSwitchToLogin={() => setView("login")} />
      );
    }

    // Affiche les composants après authentification
    switch (view) {
      case "detail":
        return <TaskDetail taskId={selectedTaskId} onBack={handleBackToList} />;
      case "edit":
        return (
          <TaskEditForm
            task={selectedTask}
            onTaskUpdated={handleTaskUpdated}
            onCancel={handleBackToList}
          />
        );
      case "list":
      default:
        return (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Ajouter une tâche
              </Button>
              <Button
                type="default"
                 onClick={fetchTasks}
              >
                <ReloadOutlined />
              </Button>
            </div>
            <TaskList tasks={tasks} onEditTask={handleEditTask} onViewTask={handleViewTask} />
          </>
        );
    }
  };

  return (
    <div className="App">
      <header
        className="App-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>
          <span>
            <UnorderedListOutlined />
          </span>{" "}
          Gestionnaire de Tâches
        </h2>
        {isAuthenticated && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <UserOutlined style={{ fontSize: "18px", color: "white" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span style={{ color: "white" }}>{username}</span>
              <Button type="link" onClick={handleLogout} style={{ color: "white", padding: 0 }}>
                Se déconnecter
              </Button>
            </div>
          </div>
        )}
      </header>
      <main>{renderView()}</main>
      <Modal
        title="Ajouter une tâche"
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <TaskForm
          onTaskAdded={handleTaskAdded}
          onClose={() => setIsModalVisible(false)}
        />
      </Modal>
    </div>
  );
}

export default App;