import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import { message } from 'antd';

const TaskForm = ({ initialTask, onTaskUpdated, onClose }) => {
  const [title, setTitle] = useState(initialTask ? initialTask.title : '');
  const [completed, setCompleted] = useState(initialTask ? initialTask.completed : false); // New state for status
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setCompleted(initialTask.completed); 
    }
  }, [initialTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      if (initialTask) {
        // Update existing task
        await taskService.updateTask(initialTask.id, { title, completed }); 
        message.success('Tâche mise à jour avec succès !');
        if (onTaskUpdated) onTaskUpdated();
      } else {
        // Create new task
        await taskService.createTask({ title, completed }); 
        message.success('Tâche ajoutée avec succès !');
      }
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      message.error('Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Titre :</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de la tâche"
          disabled={submitting}
        />
      </div>
      <div>
        <label htmlFor="status">Statut :</label>
        <select
          id="status"
          value={completed}
          onChange={(e) => setCompleted(e.target.value === 'true')} 
          disabled={submitting}
        >
          <option value="false">En cours</option>
          <option value="true">Terminé</option>
        </select>
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'En cours...' : initialTask ? 'Modifier' : 'Ajouter'}
      </button>
    </form>
  );
};

export default TaskForm;
