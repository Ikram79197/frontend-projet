import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { taskService } from '../services/api';
import TaskDetail from './TaskDetail';
import TaskForm from './TaskForm';
import './TaskList.css';

const TaskList = ({ onEditTask }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); // Modal pour les détails
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // Modal pour l'ajout
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur complète:", err);
      setError('Erreur lors du chargement des tâches');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setIsAddModalVisible(false); // Ferme la modal d'ajout
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Confirmation de suppression',
      content: 'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      okText: 'Oui',
      cancelText: 'Non',
      onOk: async () => {
        try {
          await taskService.deleteTask(id);
          message.success('Tâche supprimée avec succès');
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
          message.error('Erreur lors de la suppression de la tâche');
        }
      },
    });
  };

  const toggleTaskStatus = async (task) => {
    try {
      const updatedTask = await taskService.updateTask(task.id, {
        ...task,
        completed: !task.completed,
      });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
      );
      message.success('Statut de la tâche mis à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      message.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleViewTask = (taskId) => {
    setSelectedTaskId(taskId);
    setIsDetailModalVisible(true); // Ouvre uniquement la modal de détails
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsEditModalVisible(true);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setIsEditModalVisible(false);
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="task-list-container">
      <Table
        dataSource={tasks}
        columns={[
          {
            title: 'Titre',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
              <span
                className="task-title"
                style={{ cursor: 'pointer', color: '#1890ff' }}
                onClick={() => handleViewTask(record.id)}
              >
                {text}
              </span>
            ),
          },
          {
            title: 'Statut',
            dataIndex: 'completed',
            key: 'completed',
            render: (completed) => (
              <Tag color={completed ? 'green' : 'orange'}>
                {completed ? 'Terminé' : 'En cours'}
              </Tag>
            ),
          },
          {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleEditTask(record)}
                  style={{ backgroundColor: "#28a745", color: "#fff", borderColor: "#28a745" }}
                />
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.id)}
                />
              </div>
            ),
          },
        ]}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
      />
      {/* Modal pour les détails */}
      <Modal
        title="Détails de la tâche"
        visible={isDetailModalVisible}
        footer={null}
        onCancel={() => setIsDetailModalVisible(false)}
      >
        {selectedTaskId && (
          <TaskDetail
            taskId={selectedTaskId}
            onBack={() => setIsDetailModalVisible(false)}
          />
        )}
      </Modal>
      {/* Modal pour l'ajout */}
      <Modal
        title="Ajouter une tâche"
        visible={isAddModalVisible}
        footer={null}
        onCancel={() => setIsAddModalVisible(false)}
      >
        <TaskForm
          onTaskAdded={handleAddTask}
          onClose={() => setIsAddModalVisible(false)}
        />
      </Modal>
      {/* Modal pour l'édition */}
      <Modal
        title="Modifier la tâche"
        visible={isEditModalVisible}
        footer={null}
        onCancel={() => setIsEditModalVisible(false)}
      >
        {taskToEdit && (
          <TaskForm
            initialTask={taskToEdit}
            onTaskUpdated={handleTaskUpdated}
            onClose={() => setIsEditModalVisible(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default TaskList;