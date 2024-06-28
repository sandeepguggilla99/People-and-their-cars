// Author
// Sandeep Guggilla

import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { Card, Button, Input } from "antd";

const GET_PEOPLE = gql`
  query GetPeople {
    people {
      id
      firstName
      lastName
      cars {
        id
        year
        make
        model
        price
      }
    }
  }
`;

const DELETE_PERSON = gql`
  mutation DeletePerson($id: ID!) {
    deletePerson(id: $id) {
      id
    }
  }
`;

const DELETE_CAR = gql`
  mutation DeleteCar($id: ID!) {
    deleteCar(id: $id) {
      id
    }
  }
`;

const UPDATE_PERSON = gql`
  mutation UpdatePerson($id: ID!, $firstName: String, $lastName: String) {
    updatePerson(id: $id, firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

const UPDATE_CAR = gql`
  mutation UpdateCar(
    $id: ID!
    $year: Int
    $make: String
    $model: String
    $price: Float
    $personId: ID
  ) {
    updateCar(
      id: $id
      year: $year
      make: $make
      model: $model
      price: $price
      personId: $personId
    ) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

const PeopleList = () => {
  const { loading, error, data } = useQuery(GET_PEOPLE);

  const [deletePerson] = useMutation(DELETE_PERSON, {
    refetchQueries: [{ query: GET_PEOPLE }],
  });

  const [deleteCar] = useMutation(DELETE_CAR, {
    refetchQueries: [{ query: GET_PEOPLE }],
  });

  const [updatePerson] = useMutation(UPDATE_PERSON, {
    refetchQueries: [{ query: GET_PEOPLE }],
  });

  const [updateCar] = useMutation(UPDATE_CAR, {
    refetchQueries: [{ query: GET_PEOPLE }],
  });

  const [editPersonId, setEditPersonId] = useState(null);
  const [editCarId, setEditCarId] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error</p>;
  }

  const handleEditPerson = (person) => {
    setFirstName(person.firstName);
    setLastName(person.lastName);

    setEditPersonId(person.id);
  };

  const handleSavePerson = (id) => {
    updatePerson({ variables: { id, firstName, lastName } });

    setEditPersonId(null);
  };

  const handleEditCar = (car) => {
    setYear(car.year);
    setMake(car.make);
    setModel(car.model);
    setPrice(car.price);
    setEditCarId(car.id);
  };

  const handleSaveCar = (id, personId) => {
    updateCar({
      variables: {
        id,
        year: parseInt(year),
        make,
        model,
        price: parseFloat(price),

        personId,
      },
    });
    setEditCarId(null);
  };

  return (
    /* This code snippet is rendering a list of people with their associated cars in a card-based
    layout.*/
    <div className="card-container">
      {data.people.map((person) => (
        <Card
          key={person.id}
          title={`${person.firstName} ${person.lastName}`}
          extra={
            <div>
              {editPersonId === person.id ? (
                <>
                  <Input
                    style={{ marginBottom: "10px" }}
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Input
                    style={{ marginBottom: "10px" }}
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <Button
                    type="primary"
                    onClick={() => handleSavePerson(person.id)}
                    style={{ marginRight: "10px" }}
                  >
                    Save
                  </Button>
                  <Button onClick={() => setEditPersonId(null)}>Cancel</Button>
                </>
              ) : (
                <>
                  <Button
                    type="primary"
                    onClick={() => handleEditPerson(person)}
                    style={{ marginRight: "10px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="danger"
                    onClick={() =>
                      deletePerson({ variables: { id: person.id } })
                    }
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          }
        >
          {person.cars.map((car) => (
            <Card
              type="inner"
              title={`${car.year} ${car.make} ${car.model}`}
              key={car.id}
              extra={
                <div>
                  {editCarId === car.id ? (
                    <>
                      <Input
                        style={{ marginBottom: "10px" }}
                        placeholder="Year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      />
                      <Input
                        style={{ marginBottom: "10px" }}
                        placeholder="Make"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                      />
                      <Input
                        style={{ marginBottom: "10px" }}
                        placeholder="Model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                      />
                      <Input
                        style={{ marginBottom: "10px" }}
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                      <Button
                        type="primary"
                        onClick={() => handleSaveCar(car.id, person.id)}
                        style={{ marginRight: "10px" }}
                      >
                        Save
                      </Button>
                      <Button onClick={() => setEditCarId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="primary"
                        onClick={() => handleEditCar(car)}
                        style={{ marginRight: "10px" }}
                      >
                        Edit
                      </Button>
                      <Button
                        type="danger"
                        onClick={() => deleteCar({ variables: { id: car.id } })}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              }
            >
              <p>Price: ${car.price}</p>
            </Card>
          ))}
          <Link to={`/people/${person.id}`}>Learn More</Link>
        </Card>
      ))}
    </div>
  );
};

export default PeopleList;
