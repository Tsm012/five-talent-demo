import Head from 'next/head'

import Navbar from 'react-bootstrap/Navbar';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

import React, { useState } from 'react';
//import { withIronSession } from "next-iron-session";

const MongoClient = require('mongodb').MongoClient;

export default function Home({ homes }) {

    //Switches for create and edit modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    //Switch to show error for duplicate MLS dds
    const [showError, setShowError] = useState(false);

    //List of all homes in the System
    const [homesList, setHomesList] = useState(homes);

    //Edit home model
    const [editHomeModel, setEditHomeModel] = useState({
        _id: "",
        MLSNumber: "",
        Street1: "",
        Street2: "",
        City: "",
        State: "",
        ZipCode: "",
        Neighborhood: "",
        SalesPrice: "",
        DateListed: "",
        Bedrooms: "",
        Photos: "",
        Bathrooms: "",
        GarageSize: "",
        SquareFeet: "",
        LotSize: "",
        Description: ""
    });

    //Create home model
    const [createHomeModel, setCreateHomeModel] = useState({
        MLSNumber: "",
        Street1: "",
        Street2: "",
        City: "",
        State: "",
        ZipCode: "",
        Neighborhood: "",
        SalesPrice: "",
        DateListed: "",
        Bedrooms: "",
        Photos: "",
        Bathrooms: "",
        GarageSize: "",
        SquareFeet: "",
        LotSize: "",
        Description: ""
    });

    const handleChangeToCreateHomeModel = async (event) => {
        setCreateHomeModel({
            ...createHomeModel,
            [event.target.name]: event.target.value
        });
    }

    const handleChangeToEditHomeModel = async (event) => {

        setEditHomeModel({
            ...editHomeModel,
            [event.target.name]: event.target.value
        });

        
    }

    const handleClickForListingItem = async (home) => {
        setEditHomeModel({
            _id: home._id,
            MLSNumber: home.MLSNumber,
            Street1: home.Street1,
            Street2: home.Street2,
            City: home.City,
            State: home.State,
            ZipCode: home.ZipCode,
            Neighborhood: home.Neighborhood,
            SalesPrice: home.SalesPrice,
            DateListed: home.DateListed,
            Bedrooms: home.Bedrooms,
            Photos: home.Photos,
            Bathrooms: home.Bathrooms,
            GarageSize: home.GarageSize,
            SquareFeet: home.SquareFeet,
            LotSize: home.LotSize,
            Description: home.Description
        });

        setShowEditModal(true);
    }

    const handleCreateNewListing = async (event) => {

        event.preventDefault();

        const rawResponse = await fetch('api/homes', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(createHomeModel)
        });

        const content = await rawResponse.json();

        if (content.error) {
            setShowError(true);
        } else {
            setHomesList(content)
            setShowCreateModal(false)
        }

    };

    const handleEditListing = async (event) => {
        event.preventDefault();

        const rawResponse = await fetch('api/homes', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editHomeModel)
        });

        const content = await rawResponse.json();

        if (content.error) {
            setShowError(true);
        } else {
            setHomesList(content)
            setShowEditModal(false)
        }

    };

    const handleDeleteListing = async () => {

        event.preventDefault();

        const rawResponse = await fetch('api/homes', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editHomeModel)
        });

        const content = await rawResponse.json();

        if (content.error) {
            setShowError(true);
        } else {
            setHomesList(content)
            setShowEditModal(false)
        }

        setShowEditModal(false)
    }

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">Killer Navbar</Navbar.Brand>
            </Navbar>

            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>Real Estate Admin</Card.Title>
                        
                        <Button variant="primary" onClick={() => setShowCreateModal(true)}>Create Listing</Button>
                    </Card.Body>
                </Card>

                <ListGroup>
                    {
                        homesList.map((home) =>
                            <ListGroup.Item>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{home.MLSNumber}</Card.Title>
                                        <Card.Text>
                                            <p><b>City: </b> {home.City}</p>
                                            <p><b>Sales Price: </b> {home.SalesPrice}</p>
                                            <p><b>Bedrooms:</b> {home.Bedrooms}</p>
                                            <p><b>Baths: </b> {home.Bathrooms}</p>
                                        </Card.Text>
                                        <Button variant="primary" onClick={() => handleClickForListingItem(home)}>View Property</Button>
                                    </Card.Body>
                                </Card>
                            </ListGroup.Item>
                        )
                    }

                </ListGroup>

            </Container>

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
                <Form onSubmit={handleCreateNewListing}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Listing</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>MLS Number</Form.Label>
                                <Form.Control required type="text" placeholder="Enter MLS Number" name="MLSNumber" onChange={handleChangeToCreateHomeModel} />
                                <Alert show={showError} variant="danger" onClose={() => setShowError(false)} dismissible>
                                    <p>
                                        MLS Number Already Exists
                                    </p>
                                </Alert>
                            </Form.Group>
                        </Form.Row>

                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control name="Street1" placeholder="1234 Main St" onChange={handleChangeToCreateHomeModel} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Address 2</Form.Label>
                            <Form.Control name="Street2" placeholder="Apartment, studio, or floor" onChange={handleChangeToCreateHomeModel} />
                        </Form.Group>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>City</Form.Label>
                                <Form.Control name="City" onChange={handleChangeToCreateHomeModel} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>State</Form.Label>
                                <Form.Control name="State" onChange={handleChangeToCreateHomeModel} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Zip</Form.Label>
                                <Form.Control name="ZipCode" onChange={handleChangeToCreateHomeModel} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Neighborhood</Form.Label>
                                <Form.Control name="Neighborhood" onChange={handleChangeToCreateHomeModel} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Sales Price</Form.Label>
                                <Form.Control name="SalesPrice" onChange={handleChangeToCreateHomeModel} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Date Listed</Form.Label>
                                <Form.Control name="DateListed" onChange={handleChangeToCreateHomeModel} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Bedrooms</Form.Label>
                                <Form.Control name="Bedrooms" onChange={handleChangeToCreateHomeModel} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Photos</Form.Label>
                                <Form.Control name="Photos" onChange={handleChangeToCreateHomeModel} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Bathrooms</Form.Label>
                                <Form.Control name="Bathrooms" onChange={handleChangeToCreateHomeModel} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Garage Size</Form.Label>
                                <Form.Control name="GarageSize" onChange={handleChangeToCreateHomeModel} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Square Feet</Form.Label>
                                <Form.Control name="SquareFeet" onChange={handleChangeToCreateHomeModel} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Lot Size</Form.Label>
                                <Form.Control name="LotSize" onChange={handleChangeToCreateHomeModel} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Description</Form.Label>
                                <Form.Control name="Description" as='textarea' onChange={handleChangeToCreateHomeModel} />
                            </Form.Group>
                        </Form.Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                            Close
                    </Button>
                        <Button variant="primary" type="submit">
                            Create New Listing
                    </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Form onSubmit={handleEditListing}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Listing</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>MLS Number</Form.Label>
                                <Form.Control required type="text" placeholder="Enter MLS Number" defaultValue={editHomeModel.MLSNumber} name="MLSNumber" onChange={handleChangeToEditHomeModel} />
                                <Alert show={showError} variant="danger" onClose={() => setShowError(false)} dismissible>
                                    <p>
                                        MLS Number Already Exists
                                    </p>
                                </Alert>
                            </Form.Group>
                        </Form.Row>

                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control name="Street1" placeholder="1234 Main St" onChange={handleChangeToEditHomeModel} defaultValue={editHomeModel.Street1} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Address 2</Form.Label>
                            <Form.Control name="Street2" placeholder="Apartment, studio, or floor" onChange={handleChangeToEditHomeModel} defaultValue={editHomeModel.Street2} />
                        </Form.Group>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>City</Form.Label>
                                <Form.Control name="City" onChange={handleChangeToEditHomeModel} defaultValue={editHomeModel.City} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>State</Form.Label>
                                <Form.Control name="State" onChange={handleChangeToEditHomeModel} defaultValue={editHomeModel.State} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Zip</Form.Label>
                                <Form.Control name="ZipCode" onChange={handleChangeToEditHomeModel} defaultValue={editHomeModel.Zip} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Neighborhood</Form.Label>
                                <Form.Control name="Neighborhood" onChange={handleChangeToEditHomeModel} defaultValue={editHomeModel.Neighborhood} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Sales Price</Form.Label>
                                <Form.Control name="SalesPrice" onChange={handleChangeToEditHomeModel} defaultValue={editHomeModel.SalesPrice} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Date Listed</Form.Label>
                                <Form.Control name="DateListed" onChange={handleChangeToEditHomeModel} defaultValue={editHomeModel.DateListed} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Bedrooms</Form.Label>
                                <Form.Control name="Bedrooms" onChange={handleChangeToEditHomeModel} defaultValue={editHomeModel.Bedrooms} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.File id="formcheck-api-regular">
                                    <Form.File.Label>Photo</Form.File.Label>
                                    <Form.File.Input name="Photos" onChange={handleChangeToEditHomeModel} defaultValue={editHomeModel.Photos}/>
                                </Form.File>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Bathrooms</Form.Label>
                                <Form.Control name="Bathrooms" onChange={handleChangeToEditHomeModel} defaultValue={editHomeModel.Bathrooms} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Garage Size</Form.Label>
                                <Form.Control name="GarageSize" onChange={handleChangeToEditHomeModel} defaultValue={editHomeModel.GarageSize} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Square Feet</Form.Label>
                                <Form.Control name="SquareFeet" onChange={handleChangeToEditHomeModel} defaultValue={editHomeModel.SquareFeet} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Lot Size</Form.Label>
                                <Form.Control name="LotSize" onChange={handleChangeToEditHomeModel} defaultValue={editHomeModel.LotSize} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Description</Form.Label>
                                <Form.Control name="Description" as='textarea' onChange={handleChangeToEditHomeModel} defaultValue={editHomeModel.Description} />
                            </Form.Group>
                        </Form.Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" className="text-left" onClick={handleDeleteListing}>
                            Delete Listing
                        </Button>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Update Listing
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
export async function getStaticProps() {

    const client = new MongoClient(process.env.mongodbConnectionString, { useNewUrlParser: true });

    await client.connect();

    const collection = client.db("five-talent-realestate").collection("homes")

    let homes = await collection.find({}).toArray();

    homes = JSON.parse(JSON.stringify(homes));

    client.close();

    return {
        props: {
            homes,
        },
    }
}