import React, { useEffect, useState } from 'react'
import {doc, collection, getDoc, addDoc, deleteDoc, onSnapshot} from 'firebase/firestore'
import {db} from '../firebase'
import 'firebase/firestore';
import {useAuth} from '../contexts/AuthContext'
import UserPageTemplate from '../templates/UserPageTemplate';
import {Card, ListGroup, ListGroupItem, Spinner, Carousel, Form, Button} from 'react-bootstrap'


export default function Profile() {

  const {currentUser} = useAuth();

  const achivesCollectionRef =  collection(db, "Achivements", currentUser.uid, "UserAchivements");
  
  const [newAchivName, setNewAchivName] = useState("")
  const [achivements, setAchivements] = useState({})

  const [basicUserData, setBasicUserData] = useState({})
  const [birthdayDate, setBirthdayDate] = useState("")
  const [discipline, setDiscipline] = useState("")
  const [accType, setAccType] = useState("")

  const [extUserData, setExtUserData] = useState({})

  const [imagesData, setImagesData] = useState({})


  
  const getCurrUserData = async () =>{
    const userData = await getDoc(doc(db, "BasicProfile", currentUser.uid));
    const userDataObj = userData.data();
    setBasicUserData(userDataObj);

    setBirthdayDate(userDataObj.birthday_date.toDate().toLocaleDateString())

    const userDisc = await getDoc(doc(db, "Disciplines", userDataObj.discipline_id));
    setDiscipline(userDisc.data().name)

    const userAccType = await getDoc(doc(db, "AccountType", userDataObj.acc_type_id));
    setAccType(userAccType.data().type)

    const extendedUserData = await getDoc(doc(db, "ExtendedProfile", currentUser.uid));
    const extendedUserDataObj = extendedUserData.data();
    setExtUserData(extendedUserDataObj)

    const imagesData = await getDoc(doc(db, "Gallery", currentUser.uid));
    const imagesDataObj = imagesData.data();
    setImagesData(imagesDataObj)
  }
  
  const addAchivement = async (e) => {
    e.preventDefault();

    await addDoc(achivesCollectionRef, { name: newAchivName});
    setNewAchivName("")
  }

  const deleteAchivement = async (id) => {
    await deleteDoc(doc(db, "Achivements", currentUser.uid, "UserAchivements", id));
  };

  useEffect(() => {
    getCurrUserData();

    const unsubscribeAchivements = onSnapshot(achivesCollectionRef, (snapshot) => {
      const achives = [];
      snapshot.forEach((doc) => {
        achives.push({ ...doc.data(), id: doc.id });
      });
      setAchivements(achives)
    });

    return unsubscribeAchivements
  }, [])

  

  return (
    <UserPageTemplate>
      <h1 className='mt-2 mb-4'>Profile</h1>
      {accType ?
        <>
          <Card className='mx-auto mt-2 mb-5' style={{ maxWidth: '30rem' }}>
            <Card.Img variant="top" src={basicUserData.profileImage} alt='user avatar' style={{ height: '250px', objectFit: 'contain'}}/>
            <Card.Body>
              <Card.Title>{basicUserData.name} {basicUserData.surname}</Card.Title>
              <Card.Text>{basicUserData.s_desc}</Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroupItem>Urodzony: {birthdayDate}</ListGroupItem>
              <ListGroupItem>Miasto: {basicUserData.city}</ListGroupItem>
              <ListGroupItem>Dyscyplina: {discipline}</ListGroupItem>
              <ListGroupItem>Typ konta: {accType}</ListGroupItem>
            </ListGroup>
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">Opis</Card.Subtitle>
              <Card.Text>{extUserData.l_desc}</Card.Text>
            </Card.Body>
            <Carousel>
              <Carousel.Item interval={100000}>
                <img
                  className="d-block w-100"
                  src={imagesData.photo_1}
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item interval={100000}>
                <img
                  className="d-block w-100"
                  src={imagesData.photo_2}
                  alt="Second slide"
                />
              </Carousel.Item>
              <Carousel.Item interval={100000}>
                <img
                  className="d-block w-100"
                  src={imagesData.photo_3}
                  alt="Third slide"
                />
              </Carousel.Item>
            </Carousel>
            <Card.Body>
              <Card.Title>Osiągnięcia</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
              {achivements.map((achiv, i) => {
                  return (
                    <ListGroupItem key={i} className="d-flex justify-content-between align-items-center">
                      {achiv.name}
                      <Button 
                      className="w-10" 
                      variant="danger" 
                      size="sm" 
                      onClick={() => {
                        deleteAchivement(achiv.id);
                      }}> 
                        X
                      </Button>
                    </ListGroupItem>
                  )
              })}  
            </ListGroup>
            <Card.Body>
              <Card.Title className="mb-2 text-muted">Dodaj osiągnięcie</Card.Title>
              <Form onSubmit={addAchivement}>
              <Form.Group id="name">
                    <Form.Label>Nazwa osiągnięcia</Form.Label>
                    <Form.Control 
                    type="text" 
                    onChange={(event) => {
                      setNewAchivName(event.target.value);
                    }}
                    value={newAchivName}
                    required
                    ></Form.Control>
                    <Button className="w-20 mt-3" type="submit"> 
                      Dodaj
                    </Button>
                  </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </>
        :
        <div className='mt-10 d-flex justify-content-center'>
          <Spinner animation="border" />
        </div>
      }
    </UserPageTemplate>
  )
}
