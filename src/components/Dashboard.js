import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from "firebase/firestore";
import {db} from '../firebase'
import UserPageTemplate from '../templates/UserPageTemplate';
import {Card, Button} from 'react-bootstrap'
import { Link } from "react-router-dom";

export default function Dashboard() {

  const q = query(collection(db, "BasicProfile"), where("acc_type_id", "==", "0"));
  const [athletesData, setAthletesData] = useState([]);

  useEffect(() => {

    const getAthlets = async() =>{
      const querySnapshot = await getDocs(q);
      setAthletesData(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

    }
    getAthlets();
  }, [])

  return (
    <UserPageTemplate>
        <h1 className='mt-2 mb-4'>Dashboard</h1>
        {athletesData.map((athelte, i) => {
                return (
                    <Card key={i} className='mb-3' border="dark">
                      <Card.Header >{athelte.name} {athelte.surname}</Card.Header>
                      <Card.Body className="d-flex justify-content-start" style={{gap: '20px'}}>
                        <Card.Img src={athelte.profileImage} style={{ width: '70px', height: '70px' }}/>
                        <div style={{flexGrow: '1'}}>
                        <Card.Text>{athelte.birthday_date.toDate().toLocaleDateString()}</Card.Text>
                        </div>
                        <div style={{flexGrow: '3'}}>
                        <Card.Text>{athelte.s_desc}</Card.Text>
                        </div>
                        <Link to={`/dashboard/${athelte.id}`}>Szczegóły</Link>
                      </Card.Body>
                    </Card>
                )
            })}
    </UserPageTemplate>
  )
}
