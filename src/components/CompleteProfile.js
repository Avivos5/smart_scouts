import React, {useRef} from 'react'
import { Form, Button, Card, Alert } from "react-bootstrap";
import {useAuth} from '../contexts/AuthContext'
import {db, storage} from '../firebase'
import firebase from 'firebase/compat/app';
import {collection, addDoc, setDoc, doc,  Timestamp} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

function CompleteProfile() {

  const nameRef = useRef();
  const surnameRef = useRef();
  const disciplineRef = useRef();
  const birthdayRef = useRef();
  const shortDescRef = useRef();
  const profilePicRef = useRef();
  
  const {currentUser} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault()

    // const currDiscipline = disciplineRef.current.value;
    const currImage = profilePicRef.current.files[0];
    // let imageStorageUrl;

    const storageRef = ref(storage, `ProfileImages/${currImage.name}`);
    const uploadTask = uploadBytesResumable(storageRef, currImage);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          // const imageStorageUrl = url
          // console.log(imageStorageUrl)

            // addDoc(collection(db, 'BasicProfile', currentUser.uid), {
              setDoc(doc(db, "BasicProfile", currentUser.uid), {
              name: nameRef.current.value,
              surname: surnameRef.current.value,
              // discipline: firebase.database().ref(`Disciplines/${disciplineRef.current.value}`),
              // birthday_date: Timestamp.fromDate(birthdayRef.current.value),
              s_desc: shortDescRef.current.value,
              image: url,
              is_promoted: false
            })

        })
      }
    )


    // storage.ref(`ProfileImages/${currImage.name}`).put(currImage)
    // .on("state_changed", alert("success"), alert, () => {
  
    //   // Getting Download Link
    //   storage.ref("ProfileImages").child(currImage.name).getDownloadURL()
    //     .then((url) => {
    //       ImageStorageUrl = url;
    //     })
    // });


    // try {
    //   await addDoc(collection(db, 'BasicProfile'), {
    //     name: nameRef.current.value,
    //     surname: surnameRef.current.value,
    //     discipline: firebase.database().ref(`Disciplines/${currDiscipline}`),
    //     birthday_date: Timestamp.fromDate(birthdayRef.current.value),
    //     s_desc: shortDescRef.current.value,

    //   })
    // } catch (err) {
    //   alert(err)
    // }

  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Uzupełnij profil</h2>
          {/* {error && <Alert variant="danger">{error}</Alert>} */}
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
