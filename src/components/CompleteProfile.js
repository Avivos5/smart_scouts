import React, {useRef} from 'react'
import { Form, Button, Card} from "react-bootstrap";
import {useAuth} from '../contexts/AuthContext'
import {db, storage} from '../firebase'
import {setDoc, doc,  Timestamp} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

function CompleteProfile() {

  const nameRef = useRef();
  const surnameRef = useRef();
  const disciplineRef = useRef();
  const accTypeRef = useRef();
  const birthdayRef = useRef();
  const shortDescRef = useRef();
  const profilePicRef = useRef();
  
  const {currentUser} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault()

    const currImage = profilePicRef.current.files[0];
    const storageRef = ref(storage, `ProfileImages/${currImage.name}`);
    const uploadTask = uploadBytesResumable(storageRef, currImage);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {

            setDoc(doc(db, "BasicProfile", currentUser.uid), {
              name: nameRef.current.value,
              surname: surnameRef.current.value,
              discipline_id: parseInt(disciplineRef.current.value),
              acc_type_id: parseInt(accTypeRef.current.value),
              birthday_date: Timestamp.fromDate(new Date(birthdayRef.current.value)),
              s_desc: shortDescRef.current.value,
              image: url,
              is_promoted: false,
              acc_status_id: 0,
            })

            setDoc(doc(db, "ExtendedProfile", currentUser.uid), {
              l_desc: "",
              video_url: ""
            })

        })
      }
    )
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Uzupełnij profil</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Imię</Form.Label>
              <Form.Control type="text" ref={nameRef} required></Form.Control>
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Nazwisko</Form.Label>
              <Form.Control
                type="text"
                ref={surnameRef}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group id="discipline">
            <Form.Label>Dyscyplina</Form.Label>
              <Form.Select ref={disciplineRef}>
                <option value="0">Piłka nożna</option>
                <option value="1">Siatkówka</option>
                <option value="2">Koszykówka</option>
                <option value="3">Łucznictwo</option>
                <option value="4">Karate</option>
              </Form.Select>
            </Form.Group>
            <Form.Group id="accountType">
            <Form.Label>Typ konta</Form.Label>
              <Form.Select ref={accTypeRef}>
                <option value="0">Zawodnik</option>
                <option value="1">Trener</option>
              </Form.Select>
            </Form.Group>
            <Form.Group id="birthday">
              <Form.Label>Data urodzin</Form.Label>
              <Form.Control
                type="date"
                ref={birthdayRef}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group id="shortDesc">
              <Form.Label>Krótki opis</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                ref={shortDescRef}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group id="prifileImage">
              <Form.Label>Zdjęcie profilowe</Form.Label>
              <Form.Control
                type="file"
                ref={profilePicRef}
                required
              ></Form.Control>
            </Form.Group>
             <Button className="w-100 mt-3" type="submit"> 
              Uzupełnij
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}

export default CompleteProfile
