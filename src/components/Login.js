import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography, message } from 'antd';

const { Title, Text } = Typography;

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/login', values);
      localStorage.setItem('token', response.data.token); // Stocker le token
      message.success('Connexion réussie');
      onLoginSuccess();
    } catch (error) {
      message.error('Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '8px', background: '#fff' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Connexion</Title>
      <Form layout="vertical" onFinish={handleLogin}>
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
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <Text>Pas encore inscrit ?</Text>
        <Button type="link" onClick={onSwitchToRegister}>
          Créer un compte
        </Button>
      </div>
    </div>
  );
};

export default Login;