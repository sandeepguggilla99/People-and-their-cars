// Author
// Sandeep Guggilla

import React from "react";
import PersonForm from "../components/PersonForm";
import CarForm from "../components/CarForm";
import PeopleList from "../components/PeopleList";

const Home = () => (
  /* This code snippet is defining a React functional component called `Home`. */
  <div>
    <h1>PEOPLE AND THEIR CARS</h1>
    <PersonForm />
    <CarForm />
    <PeopleList />
  </div>
);

export default Home;
