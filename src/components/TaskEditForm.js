import React, { useState } from 'react';
import { taskService } from '../services/api';

const TaskEditForm = ({ task, onTaskUpdated, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [completed, setCompleted] = useState(task.completed);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const updatedTask = await taskService.updateTask(task.id, { 
        title, 
        completed 
      });
      if (onTaskUpdated) onTaskUpdated(updatedTask);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-edit-form">
      <h3>Modifier la tâche</h3>
      <div>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Titre de la tâche"
          disabled={submitting}
        />
      </div>
      <div className="checkbox-container">
        <label>
          <input
            type="checkbox"
            checked={completed}
            onChange={e => setCompleted(e.target.checked)}
            disabled={submitting}
          />
          Terminée
        </label>
      </div>
      <div className="button-group">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button type="button" onClick={onCancel} disabled={submitting} className="cancel-button">
          Annuler
        </button>
      </div>
    </form>
  );
};

export default TaskEditForm;
