import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography, message } from 'antd';
import { API_BASE_URL } from '../constants';

const { Title, Text } = Typography;

const Register = ({ onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    const { username, password, confirmPassword } = values;

    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword) {
      message.error('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      await axios.post(API_BASE_URL+"/register", { username, password });
      message.success('Inscription réussie');
      onSwitchToLogin();
    } catch (error) {
      message.error('Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '8px', background: '#fff' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Inscription</Title>
      <Form layout="vertical" onFinish={handleRegister}>
        <Form.Item
          label="Nom d'utilisateur"
          name="username"
          rules={[{ required: true, message: 'Veuillez entrer votre nom d\'utilisateur' }]}
        >
          <Input placeholder="Nom d'utilisateur" />
        </Form.Item>
        <Form.Item
          label="Mot de passe"
          name="password"
          rules={[{ required: true, message: 'Veuillez entrer votre mot de passe' }]}
        >
          <Input.Password placeholder="Mot de passe" />
        </Form.Item>
        <Form.Item
          label="Confirmer le mot de passe"
          name="confirmPassword"
          rules={[{ required: true, message: 'Veuillez confirmer votre mot de passe' }]}
        >
          <Input.Password placeholder="Confirmer le mot de passe" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <Text>Déjà inscrit ?</Text>
        <Button type="link" onClick={onSwitchToLogin}>
          Se connecter
        </Button>
      </div>
    </div>
  );
};

export default Register;