// Author
// Sandeep Guggilla

import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Button, Input, Typography } from "antd";

const { Title } = Typography;

const GET_PERSON_WITH_CARS = gql`
  query GetPersonWithCars($id: ID!) {
    personWithCars(id: $id) {
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

const PersonDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id },
  });

  const [deletePerson] = useMutation(DELETE_PERSON, {
    onCompleted: () => navigate("/"),
  });

  const [deleteCar] = useMutation(DELETE_CAR, {
    refetchQueries: [{ query: GET_PERSON_WITH_CARS, variables: { id } }],
  });

  const [updatePerson] = useMutation(UPDATE_PERSON, {
    refetchQueries: [{ query: GET_PERSON_WITH_CARS, variables: { id } }],
  });

  const [updateCar] = useMutation(UPDATE_CAR, {
    refetchQueries: [{ query: GET_PERSON_WITH_CARS, variables: { id } }],
  });

  const [editPerson, setEditPerson] = useState(false);
  const [editCar, setEditCar] = useState(null);

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

  const { personWithCars } = data;

  const handleEditPerson = () => {
    setFirstName(personWithCars.firstName);
    setLastName(personWithCars.lastName);

    setEditPerson(true);
  };

  const handleSavePerson = () => {
    updatePerson({ variables: { id, firstName, lastName } });

    setEditPerson(false);
  };

  const handleEditCar = (car) => {
    setYear(car.year);
    setMake(car.make);
    setModel(car.model);
    setPrice(car.price);
    setEditCar(car.id);
  };

  const handleSaveCar = (carId) => {
    updateCar({
      variables: {
        id: carId,
        year: parseInt(year),
        make,
        model,
        price: parseFloat(price),
        personId: id,
      },
    });

    setEditCar(null);
  };

  return (
    /* This code snippet is rendering a card component that displays details about a person along with
their cars.*/
    <Card
      title={`${personWithCars.firstName} ${personWithCars.lastName}`}
      extra={
        <div>
          {editPerson ? (
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
                onClick={handleSavePerson}
                style={{ marginRight: "10px" }}
              >
                Save
              </Button>
              <Button onClick={() => setEditPerson(false)}>Cancel</Button>
            </>
          ) : (
            <>
              <Button
                type="primary"
                onClick={handleEditPerson}
                style={{ marginRight: "10px" }}
              >
                Edit
              </Button>
              <Button
                type="danger"
                onClick={() => deletePerson({ variables: { id } })}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      }
    >
      <Title level={3}>Cars</Title>
      {personWithCars.cars.map((car) => (
        <Card
          type="inner"
          title={`${car.year} ${car.make} ${car.model}`}
          key={car.id}
          extra={
            <div>
              {editCar === car.id ? (
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
                    onClick={() => handleSaveCar(car.id)}
                    style={{ marginRight: "10px" }}
                  >
                    Save
                  </Button>
                  <Button onClick={() => setEditCar(null)}>Cancel</Button>
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

      <Link to="/" className="back-link">
        Go Back Home
      </Link>
    </Card>
  );
};

export default PersonDetail;
