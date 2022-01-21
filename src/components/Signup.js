import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import {Link, useNavigate} from 'react-router-dom'

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {signup} = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault()

    if(passwordRef.current.value !== passwordConfirmRef.current.value){
      return setError("Hasła nie są takie same.");
    }

    try{
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value)
      navigate("/complete_profile");
    }catch{
      setError("Nie udało się założyć konta :/")
    }
    setLoading(false)
  }

  return (
    <Container className='d-flex align-items-center justify-content-center' style={{minHeight: "100vh"}}>
      <div className="w-100" style={{maxWidth: '400px'}}>
        <Card bg="dark" text="white">
          <Card.Body>
            <h2 className="text-center mb-4">Rejestracja</h2>
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
              <Form.Group id="password-confirmation">
                <Form.Label>Powtórz hasło</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordConfirmRef}
                  required
                ></Form.Control>
              </Form.Group>
              <Button className="w-100 mt-3" type="submit" disabled={loading}>
                Zarejestruj
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Posiadasz już konto? <Link to="/login">Zaloguj się</Link>
        </div>
      </div>
    </Container>
  );
}
