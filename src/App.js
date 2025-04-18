import React, { useState } from "react";
import { Modal, Button } from "antd";
import { PlusCircleOutlined, UnorderedListOutlined } from "@ant-design/icons"; // Import the PlusCircleOutlined and UnorderedListOutlined icons
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import TaskDetail from "./components/TaskDetail";
import TaskEditForm from "./components/TaskEditForm";
import "./App.css";

function App() {
  const [view, setView] = useState("list"); // 'list', 'detail', 'edit'
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility

  const handleTaskAdded = () => {
    setTimeout(() => {
      window.location.reload();
    }, 600);
    setView("list");
    setIsModalVisible(false);
  };

  const handleTaskUpdated = () => {
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
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Ajouter une tâche
              </Button>
            </div>
            <TaskList onEditTask={handleEditTask} onViewTask={handleViewTask} />
          </>
        );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>
          <span>
            <UnorderedListOutlined /> {/* Replace the checkmark with this icon */}
          </span>{" "}
          Gestionnaire de Tâches
        </h2>
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
