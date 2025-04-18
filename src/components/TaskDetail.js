import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';

const TaskDetail = ({ taskId, onBack }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await taskService.getTaskById(taskId);
        setTask(data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement de la tâche');
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!task) return <div>Tâche non trouvée</div>;

  return (
    <div className="task-detail">
      <h2>Détails de la tâche</h2>
      <div className="task-info">
        <p><strong>ID:</strong> {task.id}</p>
        <p><strong>Titre:</strong> {task.title}</p>
        <p><strong>Statut:</strong> {task.completed ? 'Terminée ✅' : 'En cours ⏳'}</p>
      </div>
      <button onClick={onBack}>Fermer</button>
    </div>
  );
};

export default TaskDetail;
