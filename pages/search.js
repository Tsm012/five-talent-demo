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

    //Switch for viewing modal
    const [showEditModal, setShowEditModal] = useState(false);

    //List of all homes in the System
    const [homesList, setHomesList] = useState(homes);

    //Edit home model
    const [editHomeModel, setEditHomeModel] = useState({
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

    const handleClickForListingItem = async (home) => {
        setEditHomeModel({
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

    const handleSearchChange = async (event) => {

        var filteredList = []

        console.log(homes);

        for (var home of homes) {
            if (home.MLSNumber.includes(event.target.value)) {
                filteredList.push(home);
                continue;
            }
            if (home.City.includes(event.target.value)) {
                filteredList.push(home);
                continue;
            }
            if (home.State.includes(event.target.value)) {
                filteredList.push(home);
                continue;
            }
            if (home.ZipCode.includes(event.target.value)) {
                filteredList.push(home);
                continue;
            }
            if (home.Bedrooms.includes(event.target.value)) {
                filteredList.push(home);
                continue;
            }
            if (home.Bathrooms.includes(event.target.value)) {
                filteredList.push(home);
                continue;
            }
            if (home.SquareFeet.includes(event.target.value)) {
                filteredList.push(home);
                continue;
            }
        }

        setHomesList(filteredList);

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
                        <Card.Title>Real Estate Search</Card.Title>
                        <Card.Text>Search our listings</Card.Text>
                    </Card.Body>
                </Card>

                <Form>
                    <Row>
                        <Col>
                            <Form.Control placeholder="Search" onChange={handleSearchChange} />
                        </Col>
                    </Row>
                </Form>

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

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <ListGroup>
                    <ListGroup.Item><b>MLS Number:</b> {editHomeModel.MLSNumber}</ListGroup.Item>
                    <ListGroup.Item><b>Street Address:</b> {editHomeModel.Street1}</ListGroup.Item>
                    <ListGroup.Item><b>Street Address2:</b> {editHomeModel.Street2}</ListGroup.Item>
                    <ListGroup.Item><b>State:</b> {editHomeModel.State}</ListGroup.Item>
                    <ListGroup.Item><b>Zip Code:</b> {editHomeModel.ZipCode}</ListGroup.Item>
                    <ListGroup.Item><b>Neighborhood:</b> {editHomeModel.Neighborhood}</ListGroup.Item>
                    <ListGroup.Item><b>Sales Price:</b> {editHomeModel.SalesPrice}</ListGroup.Item>
                    <ListGroup.Item><b>Date Listed:</b> {editHomeModel.DateListed}</ListGroup.Item>
                    <ListGroup.Item><b>Bedrooms:</b> {editHomeModel.Bedrooms}</ListGroup.Item>
                    <ListGroup.Item><b>Photos:</b> {editHomeModel.Photos}</ListGroup.Item>
                    <ListGroup.Item><b>Bathrooms:</b> {editHomeModel.Bathrooms}</ListGroup.Item>
                    <ListGroup.Item><b>GarageSize:</b> {editHomeModel.GarageSize}</ListGroup.Item>
                    <ListGroup.Item><b>Square Feet:</b> {editHomeModel.SquareFeet}</ListGroup.Item>
                    <ListGroup.Item><b>Lot Size:</b> {editHomeModel.LotSize}</ListGroup.Item>
                    <ListGroup.Item><b>Description:</b> {editHomeModel.Description}</ListGroup.Item>
                </ListGroup>

                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                    Close
                </Button>
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