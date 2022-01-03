import React, {useState, useEffect} from 'react';
import firebase from './firebase';

function App() {
  const ref = firebase.firestore().collection("BasicProfile");

  function getFBData() {
    ref.get().then((item) => {
      const items = item.docs.map((doc) => doc.data());
      console.log(items);
    });
  }
  useEffect(() => {
    getFBData();
    // eslint-disable-next-line
  }, []);


  return (
    <div>
      <h1>Firebase</h1>
    </div>
  );
}

export default App;
