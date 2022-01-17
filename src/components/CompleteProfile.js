import React, {useRef} from 'react'
import { Form, Button, Card, Container} from "react-bootstrap";
import {useAuth} from '../contexts/AuthContext'
import {db, storage} from '../firebase'
import "firebase/compat/storage"
import {setDoc, doc,  Timestamp} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {useNavigate} from 'react-router-dom'

function CompleteProfile() {

  const navigate = useNavigate();

  const nameRef = useRef();
  const surnameRef = useRef();
  const genderRef = useRef();
  const birthdayRef = useRef();
  const cityRef = useRef();
  const accTypeRef = useRef();
  const disciplineRef = useRef();
  const profilePicRef = useRef();
  const shortDescRef = useRef();
  const longDescRef = useRef();
  const videoLinkRef = useRef();
  const otherPicOneRef = useRef();
  const otherPicTwoRef = useRef();
  const otherPicThreeRef = useRef();
  
  const {currentUser} = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault()

    const promises = [];

    const profileImage = profilePicRef.current.files[0];

    const otherImages = []
    otherImages.push(otherPicOneRef.current.files[0])
    otherImages.push(otherPicTwoRef.current.files[0])
    otherImages.push(otherPicThreeRef.current.files[0])

    promises.push(uploadBytesResumable(ref(storage, `ProfileImages/${profileImage.name}`), profileImage).then((uploadedImg) => {
      return getDownloadURL(uploadedImg.ref);
    }));

    otherImages.forEach((image) => {
      promises.push(uploadBytesResumable(ref(storage, `OtherImages/${image.name}`), image).then((uploadedImg) => {
        return getDownloadURL(uploadedImg.ref);
      }));
    })

      Promise.all(promises)
      .then((urls) => {
        // console.log("avatar: ", urls[0])
        // console.log("other1: ", urls[1])
        // console.log("other2: ", urls[2])
        // console.log("other3: ", urls[3])

        setDoc(doc(db, "BasicProfile", currentUser.uid), {
          name: nameRef.current.value,
          surname: surnameRef.current.value,
          gender: genderRef.current.value,
          birthday_date: Timestamp.fromDate(new Date(birthdayRef.current.value)),
          city: cityRef.current.value,
          acc_type_id: accTypeRef.current.value,
          discipline_id: disciplineRef.current.value,
          profileImage: urls[0],
          s_desc: shortDescRef.current.value,
          is_promoted: false,
          acc_status_id: 0..toString(),
          created: Timestamp.fromDate(new Date())
        })

        setDoc(doc(db, "ExtendedProfile", currentUser.uid), {
          l_desc: longDescRef.current.value,
          video_url: videoLinkRef.current.value
        })
        
        setDoc(doc(db, "Gallery", currentUser.uid), {
          photo_1: urls[1],
          photo_2: urls[2],
          photo_3: urls[3]
        })

        navigate("/profile");

      })
      .catch((err) => console.log(err));
  }

  return (
    <Container className='d-flex align-items-center justify-content-center' style={{minHeight: "100vh"}}>
      <div className="w-100" style={{maxWidth: '400px'}}>
        <Card bg="dark" text="white">
          <Card.Body>
            <h2 className="text-center mb-4">Uzupełnij profil</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group id="name">
                <Form.Label>Imię</Form.Label>
                <Form.Control type="text" ref={nameRef} required></Form.Control>
              </Form.Group>
              <Form.Group id="surname">
                <Form.Label>Nazwisko</Form.Label>
                <Form.Control
                  type="text"
                  ref={surnameRef}
                  required
                ></Form.Control>
              </Form.Group>
              <Form.Group id="gender">
              <Form.Label>Płeć</Form.Label>
                <Form.Select ref={genderRef}>
                  <option value="Kobieta">Kobieta</option>
                  <option value="Mężczyzna">Mężczyzna</option>
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
              <Form.Group id="location">
                <Form.Label>Miasto</Form.Label>
                <Form.Control
                  type="text"
                  ref={cityRef}
                  required
                ></Form.Control>
              </Form.Group>
              <Form.Group id="accountType">
              <Form.Label>Typ konta</Form.Label>
                <Form.Select ref={accTypeRef}>
                  <option value="0">Zawodnik</option>
                  <option value="1">Trener</option>
                </Form.Select>
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
              <Form.Group id="profileImage">
                <Form.Label>Zdjęcie profilowe</Form.Label>
                <Form.Control
                  type="file"
                  ref={profilePicRef}
                  required
                ></Form.Control>
              </Form.Group>
              <Form.Group id="shortDesc">
                <Form.Label>Krótki opis (motto)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  ref={shortDescRef}
                  required
                ></Form.Control>
              </Form.Group>
              <Form.Group id="longDesc">
                <Form.Label>Dłuższy opis</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  ref={longDescRef}
                  required
                ></Form.Control>
              </Form.Group>
              <Form.Group id="videoLink">
                <Form.Label>Link do filmu YT</Form.Label>
                <Form.Control
                  type="url"
                  ref={videoLinkRef}
                  required
                ></Form.Control>
              </Form.Group>
              <Form.Group id="otherImages">
                <Form.Label>Pozostałe zdjęcia</Form.Label>
                <Form.Control
                  type="file"
                  ref={otherPicOneRef}
                  required
                ></Form.Control>
                <Form.Control
                  type="file"
                  ref={otherPicTwoRef}
                  required
                ></Form.Control>
                <Form.Control
                  type="file"
                  ref={otherPicThreeRef}
                  required
                ></Form.Control>
              </Form.Group>
              <Button className="w-100 mt-3" type="submit"> 
                Uzupełnij
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  )
}

export default CompleteProfile
