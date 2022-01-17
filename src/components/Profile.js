import React, { useEffect, useState } from 'react'
import {doc, getDoc} from 'firebase/firestore'
import {db} from '../firebase'
import 'firebase/firestore';
import {useAuth} from '../contexts/AuthContext'
import UserPageTemplate from '../templates/UserPageTemplate';
import {Card, ListGroup, ListGroupItem, Spinner, Carousel} from 'react-bootstrap'


export default function Profile() {

  const {currentUser} = useAuth();

  const [basicUserData, setBasicUserData] = useState({})
  const [extUserData, setExtUserData] = useState({})
  const [imagesData, setImagesData] = useState({})
  const [birthdayDate, setBirthdayDate] = useState("")
  const [discipline, setDiscipline] = useState("")
  const [accType, setAccType] = useState("")

  
  useEffect(() => {
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

    getCurrUserData();
  }, [])

  

  return (
    <UserPageTemplate>
      <h1 className='mt-2 mb-4'>Profile</h1>
      {accType ?
        <>
          <Card className='mx-auto mt-2' style={{ maxWidth: '30rem' }}>
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
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={imagesData.photo_1}
                    alt="First slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={imagesData.photo_2}
                    alt="Second slide"
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={imagesData.photo_3}
                    alt="Third slide"
                  />
                </Carousel.Item>
              </Carousel>
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
