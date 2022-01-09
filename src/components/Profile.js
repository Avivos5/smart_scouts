import React, { useEffect, useState } from 'react'
import {doc, getDoc} from 'firebase/firestore'
import {db} from '../firebase'
import 'firebase/firestore';
import {useAuth} from '../contexts/AuthContext'
import UserPageTemplate from '../templates/UserPageTemplate';


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
      {accType &&
        <>
          <h1>PROFILE</h1>
          <img src={basicUserData.image} alt='user avatar'/>
          <p>Imie: {basicUserData.name}</p>
          <p>Nazwisko: {basicUserData.surname}</p>
          <p>Bio: {basicUserData.s_desc}</p>
          <p>Urodzony: {birthdayDate}</p>
          <p>Dyscyplina: {discipline}</p>
          <p>Typ konta: {accType}</p>
        </>
      }
    </UserPageTemplate>
  )
}
