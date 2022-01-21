import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import {db} from '../firebase'
import UserPageTemplate from '../templates/UserPageTemplate';
import {Card, Form} from 'react-bootstrap'
import { Link } from "react-router-dom";

export default function Dashboard() {

  let q = query(collection(db, "BasicProfile"), where("acc_type_id", "==", "0"), orderBy("created", "desc")); //od najnowszego (czas dodania konta) (DOMYŚLNIE)

  const [allAthletesData, setAllAthletesData] = useState([]);
  const [athletesData, setAthletesData] = useState([]);

  const [surnameQuery, setSurnameQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [genderQuery, setGenderQuery] = useState("");
  const [disciplineQuery, setDisciplineQuery] = useState("");

  const queryChanged = (newSortingArray) => {
      let ahtletesToFilter

      if (typeof newSortingArray === "undefined") {
        ahtletesToFilter = [...allAthletesData];
      }
      else{
        ahtletesToFilter = [...newSortingArray]
        setAllAthletesData(newSortingArray)
      }

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

  const sortingChanged = async (sortType) => {

    switch (sortType) {
      case "0":
        q = query(collection(db, "BasicProfile"), where("acc_type_id", "==", "0"), orderBy("created", "desc")); //od najnowszego (czas dodania konta)
        break;
      case "1":
        q = query(collection(db, "BasicProfile"), where("acc_type_id", "==", "0"), orderBy("created")); //od najstarszego (czas dodania konta)
        break;
      case "2":
        q = query(collection(db, "BasicProfile"), where("acc_type_id", "==", "0"), orderBy("surname")); //po nazwisku alfabetycznie A-Z
        break;
      case "3":
        q = query(collection(db, "BasicProfile"), where("acc_type_id", "==", "0"), orderBy("surname", "desc")); //po nazwisku alfabetycznie Z-A
        break;
      case "4":
        q = query(collection(db, "BasicProfile"), where("acc_type_id", "==", "0"), orderBy("birthday_date", "desc")); //po dacie urodzenia od najmłodszych
        break;
      case "5":
        q = query(collection(db, "BasicProfile"), where("acc_type_id", "==", "0"), orderBy("birthday_date")); //po dacie urodzenia od najstarszych
        break;
    
      default:
        break;
    }

    const querySnapshot = await getDocs(q);
    const newSortingArray = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    queryChanged(newSortingArray)

  }

  const getAthlets = async(query) =>{
    const querySnapshot = await getDocs(query);
    setAthletesData(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    setAllAthletesData(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

  }

  useEffect(() => { getAthlets(q) }, [])

  useEffect(() => { queryChanged() }, [surnameQuery])
  
  useEffect(() => { queryChanged() }, [cityQuery])

  useEffect(() => { queryChanged() }, [genderQuery])

  useEffect(() => { queryChanged() }, [disciplineQuery])

  return (
    <UserPageTemplate>
        <h1 className='mt-2 mb-4'>Dashboard</h1>
        <div className='d-flex mb-2' style={{gap: '20px'}}>
          <div className='d-flex flex-column'>
            <h4>Filtrowanie</h4>
            {/* <Form.Label>Filtruj po nazwisku</Form.Label> */}
            <Form.Control 
            className='mb-2'
            placeholder="Nazwisko"
            onChange={(event) => {
              setSurnameQuery(event.target.value)
            }}
            value={surnameQuery}
            />
            {/* <Form.Label>Filtruj po mieście</Form.Label> */}
            <Form.Control 
            className='mb-2'
            placeholder="Miasto"
            onChange={(event) => {
              setCityQuery(event.target.value)
            }}
            value={cityQuery}
            />
            <Form.Label>Płeć</Form.Label>
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
            <Form.Label>Dyscyplina</Form.Label>
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
          </div>
          <div className='d-flex flex-column'>
            <h4>Sortowanie</h4>
            <Form.Select
            onChange={(event) => {
              sortingChanged(event.target.value)
            }}
            >
              <option value="0">Od najnowszych</option>
              <option value="1">Od najpóźniejszych</option>
              <option value="2">Alfabetycznie A-Z</option>
              <option value="3">Alfabetycznie Z-A</option>
              <option value="4">Od najmłodszych</option>
              <option value="5">Od najstarszych</option>
            </Form.Select>
          </div>
        </div>
        {athletesData.map((athelte, i) => {
                return (
                    <Card key={i} className='mb-3' border="dark">
                      <Card.Header >{athelte.name} {athelte.surname}</Card.Header>
                      <Card.Body className="d-flex justify-content-start flex-wrap" style={{gap: '20px'}}>
                        <Card.Img src={athelte.profileImage} style={{ width: '70px', height: '70px' }}/>
                        <div style={{flexGrow: '1'}}>
                          <Card.Text>{athelte.birthday_date.toDate().toLocaleDateString()}</Card.Text>
                          <Card.Text>{athelte.city}</Card.Text>
                        </div>
                        <div style={{flexGrow: '3', width: '70%'}}>
                          <Card.Text>{athelte.s_desc}</Card.Text>
                        </div>
                        <div className="d-flex justify-content-center flex-column" style={{flexGrow: '1'}}>
                        <Link className="btn btn-primary" to={`/dashboard/${athelte.id}`}>Szczegóły</Link>
                        </div>
                      </Card.Body>
                    </Card>
                )
            })}
    </UserPageTemplate>
  )
}
