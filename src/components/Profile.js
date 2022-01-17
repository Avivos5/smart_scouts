import React, { useEffect, useState } from 'react'
import {doc, getDoc} from 'firebase/firestore'
import {db} from '../firebase'
import 'firebase/firestore';
import {useAuth} from '../contexts/AuthContext'
import UserPageTemplate from '../templates/UserPageTemplate';
import {Card, ListGroup, ListGroupItem, Spinner} from 'react-bootstrap'


export default function Profile() {

  const {currentUser} = useAuth();

  const [basicUserData, setBasicUserData] = useState({})
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
    }

    getCurrUserData();
  }, [])

  

  return (
    <UserPageTemplate>
      <h1 className='mt-2 mb-4'>Profile</h1>
      {accType ?
        <>
          <Card className='mx-auto mt-2' border="dark" style={{ maxWidth: '30rem' }}>
            <Card.Img variant="top" src={basicUserData.profileImage} alt='user avatar' style={{ height: '250px', objectFit: 'contain'}}/>
            <Card.Body>
              <Card.Title>{basicUserData.name} {basicUserData.surname}</Card.Title>
              <Card.Text>{basicUserData.s_desc}</Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroupItem>Urodzony: {birthdayDate}</ListGroupItem>
              <ListGroupItem>Dyscyplina: {discipline}</ListGroupItem>
              <ListGroupItem>Typ konta: {accType}</ListGroupItem>
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
