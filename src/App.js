import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { PlusCircleOutlined, ReloadOutlined, UnorderedListOutlined } from "@ant-design/icons";
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
  const [view, setView] = useState("login");
  const [tasks, setTasks] = useState([]); 
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsAuthenticated(true);
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await taskService.getAllTasks(); // Récupère les tâches via l'API
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches :", error);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setView("list");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setView("login");
  };

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]); 
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
      <header className="App-header">
        <h2>
          <span>
            <UnorderedListOutlined />
          </span>{" "}
          Gestionnaire de Tâches
        </h2>
        {isAuthenticated && (
         <Button type="link" onClick={handleLogout} style={{ color: "white" }}>
         Se déconnecter
       </Button>
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