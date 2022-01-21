import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import {Link, useNavigate} from 'react-router-dom'

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {login} = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault()

    try{
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value)
      navigate("/profile")
    }catch{
      setError("Nie udało się zalogować :/")
    }
    setLoading(false)
  }

  return (
    <Container className='d-flex align-items-center justify-content-center' style={{minHeight: "100vh"}}>
      <div className="w-100" style={{maxWidth: '400px'}}>
        <Card bg="dark" text="white">
          <Card.Body>
            <h2 className="text-center mb-4">Logowanie</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>E-mail</Form.Label>
                <Form.Control type="email" ref={emailRef} required></Form.Control>
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Hasło</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  required
                ></Form.Control>
              </Form.Group>
              <Button className="w-100 mt-3" type="submit" disabled={loading}>
                Zaloguj
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Nie masz konta? <Link to="/signup">Zarejestruj się</Link>
        </div>
      </div>
    </Container>
  );
}
