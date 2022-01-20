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
  const [surnameQuery, setSurnameQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [genderQuery, setGenderQuery] = useState("");
  const [disciplineQuery, setDisciplineQuery] = useState("");

  // const filterByCity = (cityQuery) =>{
  //   if(cityQuery == ""){
  //     setAthletesData(allAthletesData);
  //   }
  //   else{
  //     const ahtletesWithCity = allAthletesData.filter(athlete => athlete.city.toUpperCase().includes(cityQuery.toUpperCase()));
  //     setAthletesData(ahtletesWithCity);
  //     console.log(athletesData)
  //   }
  // }

  const queryChanged = () => {
    if(surnameQuery === "" && cityQuery === "" && genderQuery === "" && disciplineQuery === ""){
      setAthletesData(allAthletesData);
    }
    else{
      let ahtletesToFilter = [...allAthletesData];

      if(!(surnameQuery === ""))
        ahtletesToFilter = ahtletesToFilter.filter(athlete => athlete.surname.toUpperCase().includes(surnameQuery.toUpperCase()));

      if(!(cityQuery === ""))
        ahtletesToFilter = ahtletesToFilter.filter(athlete => athlete.city.toUpperCase().includes(cityQuery.toUpperCase()));

      if(!(genderQuery === ""))
        ahtletesToFilter = ahtletesToFilter.filter(athlete => athlete.gender.toUpperCase().includes(genderQuery.toUpperCase()));

      if(!(disciplineQuery === ""))
        ahtletesToFilter = ahtletesToFilter.filter(athlete => athlete.discipline_id.toUpperCase().includes(disciplineQuery.toUpperCase()));

      setAthletesData(ahtletesToFilter);
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

  useEffect(() => {
    queryChanged()
  }, [surnameQuery])
  
  useEffect(() => {
    queryChanged()
  }, [cityQuery])

  useEffect(() => {
    queryChanged()
  }, [genderQuery])

  useEffect(() => {
    queryChanged()
  }, [disciplineQuery])

  return (
    <UserPageTemplate>
        <h1 className='mt-2 mb-4'>Dashboard</h1>
        <Form.Label>Filtruj po nazwisku</Form.Label>
        <Form.Control 
        placeholder="Nazwisko"
        onChange={(event) => {
          setSurnameQuery(event.target.value)
        }}
        value={surnameQuery}
        />
        <Form.Label>Filtruj po mieście</Form.Label>
        <Form.Control 
        placeholder="Miasto"
        onChange={(event) => {
          setCityQuery(event.target.value)
        }}
        value={cityQuery}
        />
        <Form.Label>Filtruj po płci</Form.Label>
        <Form.Select
        onChange={(event) => {
          setGenderQuery(event.target.value)
        }}
        value={genderQuery}
        >
          <option value="">Wszyscy</option>
          <option value="Mężczyzna">Mężczyzna</option>
          <option value="Kobieta">Kobieta</option>
        </Form.Select>
        <Form.Label>Filtruj po dyscyplinie</Form.Label>
        <Form.Select
        onChange={(event) => {
          setDisciplineQuery(event.target.value)
        }}
        value={disciplineQuery}
        >
          <option value="">Wszystkie</option>
          <option value="0">Piłka nożna</option>
          <option value="1">Siatkówka</option>
          <option value="2">Koszykówa</option>
          <option value="3">Łucznictwo</option>
          <option value="4">Karate</option>
        </Form.Select>

        <h3>Sortowanie</h3>
        <Form.Label>Filtruj po dyscyplinie</Form.Label>
        <Form.Select
        onChange={(event) => {
          setDisciplineQuery(event.target.value)
        }}
        value={disciplineQuery}
        >
          <option value="">Wszystkie</option>
          <option value="0">Piłka nożna</option>
          <option value="1">Siatkówka</option>
          <option value="2">Koszykówa</option>
          <option value="3">Łucznictwo</option>
          <option value="4">Karate</option>
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
