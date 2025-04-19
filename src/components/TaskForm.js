import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import { message } from 'antd';

const TaskForm = ({ initialTask, onTaskAdded, onTaskUpdated, onClose }) => {
  const [title, setTitle] = useState(initialTask ? initialTask.title : '');
  const [completed, setCompleted] = useState(initialTask ? initialTask.completed : false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setCompleted(initialTask.completed);
    }
  }, [initialTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      message.error('Le titre est requis.');
      return;
    }
  
    setSubmitting(true);
    try {
      if (initialTask) {
        // Mise à jour d'une tâche existante
        const updatedTask = await taskService.updateTask(initialTask.id, { title, completed });
        message.success('Tâche mise à jour avec succès !');
        if (onTaskUpdated) onTaskUpdated(updatedTask);
      } else {
        // Création d'une nouvelle tâche
        const newTask = await taskService.createTask({ title, completed });
        message.success('Tâche ajoutée avec succès !');
        if (onTaskAdded) onTaskAdded(newTask); // Appelle la fonction pour mettre à jour la liste
      }
      onClose(); // Ferme le formulaire sans recharger la page
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
