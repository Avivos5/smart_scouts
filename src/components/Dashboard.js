import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import {db} from '../firebase'
import UserPageTemplate from '../templates/UserPageTemplate';
import {Card, Button, Form} from 'react-bootstrap'
import { Link } from "react-router-dom";

export default function Dashboard() {

  const q = query(collection(db, "BasicProfile"), where("acc_type_id", "==", "0"), orderBy("created", "desc")); //od najnowszego (czas dodania konta)
  // const q = query(collection(db, "BasicProfile"), where("acc_type_id", "==", "0"), orderBy("created")); //od najstarszego (czas dodania konta)
  // const q = query(collection(db, "BasicProfile"), where("acc_type_id", "==", "0"), orderBy("surname")); //po nazwisku alfabetycznie A-Z
  // const q = query(collection(db, "BasicProfile"), where("acc_type_id", "==", "0"), orderBy("surname", "desc")); //po nazwisku alfabetycznie Z-A
  // const q = query(collection(db, "BasicProfile"), where("acc_type_id", "==", "0"), orderBy("birthday_date")); //po dacie urodzenia od najstarszych
  // const q = query(collection(db, "BasicProfile"), where("acc_type_id", "==", "0"), orderBy("birthday_date", "desc")); //po dacie urodzenia od najmłodszych

  // const [cityQuery, setCityQuery] = useState("");

  const [allAthletesData, setAllAthletesData] = useState([]);
  const [athletesData, setAthletesData] = useState([]);

  const filterByCity = (cityQuery) =>{
    if(cityQuery == ""){
      setAthletesData(allAthletesData);
    }
    else{
      const ahtletesWithCity = allAthletesData.filter(athlete => athlete.city.toUpperCase().includes(cityQuery.toUpperCase()));
      setAthletesData(ahtletesWithCity);
      console.log(athletesData)
    }
  }

  const getAthlets = async() =>{
    const querySnapshot = await getDocs(q);
    setAthletesData(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    setAllAthletesData(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

  }

  useEffect(() => {

    getAthlets();
  }, [])

  return (
    <UserPageTemplate>
        <h1 className='mt-2 mb-4'>Dashboard</h1>
        <Form.Label>Filtruj po nazwisku</Form.Label>
        <Form.Control placeholder="Nazwisko"/>
        <Form.Label>Filtruj po mieście</Form.Label>
        <Form.Control 
        placeholder="Miasto"
        onChange={(event) => {
          console.log(event.target.value)
          filterByCity(event.target.value)
        }}
        />
        <Form.Label>Filtruj po płci</Form.Label>
        <Form.Select>
          <option>Mężczyzna</option>
          <option>Kobieta</option>
        </Form.Select>
        {athletesData.map((athelte, i) => {
                return (
                    <Card key={i} className='mb-3' border="dark">
                      <Card.Header >{athelte.name} {athelte.surname}</Card.Header>
                      <Card.Body className="d-flex justify-content-start" style={{gap: '20px'}}>
                        <Card.Img src={athelte.profileImage} style={{ width: '70px', height: '70px' }}/>
                        <div style={{flexGrow: '1'}}>
                        <Card.Text>{athelte.birthday_date.toDate().toLocaleDateString()}</Card.Text>
                        <Card.Text>{athelte.city}</Card.Text>
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
