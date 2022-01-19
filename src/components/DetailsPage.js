import React, { useEffect, useState } from 'react'
import {doc, collection, getDoc, onSnapshot, query, orderBy} from 'firebase/firestore'
import {db} from '../firebase'
import 'firebase/firestore';
import UserPageTemplate from '../templates/UserPageTemplate';
import {Card, ListGroup, ListGroupItem, Spinner, Carousel} from 'react-bootstrap'
import { useParams } from "react-router-dom";



export default function DetailsPage() {

  const { uid } = useParams();


  const achivesCollectionRef =  collection(db, "Achivements", uid, "UserAchivements");
  const hisotryCollectionRef =  collection(db, "History", uid, "UserHistory");
  
  const [achivements, setAchivements] = useState({})
  
  const [history, setHistory] = useState({})

  const [basicUserData, setBasicUserData] = useState({})
  const [birthdayDate, setBirthdayDate] = useState("")
  const [discipline, setDiscipline] = useState("")
  const [accType, setAccType] = useState("")

  const [extUserData, setExtUserData] = useState({})

  const [imagesData, setImagesData] = useState({})


  
  const getCurrUserData = async () =>{
    const userData = await getDoc(doc(db, "BasicProfile", uid));
    const userDataObj = userData.data();
    setBasicUserData(userDataObj);

    setBirthdayDate(userDataObj.birthday_date.toDate().toLocaleDateString())

    const userDisc = await getDoc(doc(db, "Disciplines", userDataObj.discipline_id));
    setDiscipline(userDisc.data().name)

    const userAccType = await getDoc(doc(db, "AccountType", userDataObj.acc_type_id));
    setAccType(userAccType.data().type)

    const extendedUserData = await getDoc(doc(db, "ExtendedProfile", uid));
    const extendedUserDataObj = extendedUserData.data();
    setExtUserData(extendedUserDataObj)

    const imagesData = await getDoc(doc(db, "Gallery", uid));
    const imagesDataObj = imagesData.data();
    setImagesData(imagesDataObj)
  }

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

  useEffect(() => {

    const q = query(hisotryCollectionRef, orderBy("date_from"));
    const unsubscribeHistory = onSnapshot(q, (snapshot) => {
      const history = [];
      snapshot.forEach((doc) => {
        history.push({ ...doc.data(), id: doc.id });
      });
      setHistory(history)
    });

    return unsubscribeHistory
  }, [])



  return (
    <UserPageTemplate>
      <h1 className='mt-2 mb-4'>Details page</h1>
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
                    <ListGroupItem key={i} variant="secondary" className="d-flex justify-content-between align-items-center">
                      {achiv.name}
                    </ListGroupItem>
                  )
              })}  
            </ListGroup>
            <Card.Body>
              <Card.Title>Historia</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
              {history.map((event, i) => {
                  return (
                    <ListGroupItem key={i} variant="secondary" className="d-flex justify-content-between align-items-center">
                      
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">{event.date_from} - {event.date_to}</div>
                        {event.name}
                      </div>
                    </ListGroupItem>
                  )
              })}  
            </ListGroup>
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
