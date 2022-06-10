/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState } from "react";
import Ballot from "../contracts/Ballot.json";
import { ethers } from "ethers";

// reactstrap components
import {
  ButtonGroup,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

function Collection() {
  const [input, setInput] = useState([""]);
  const [name, setName] = useState([""]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [accounts, setAccounts] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const values = [
      name,
      new Date(startTime).valueOf(),
      new Date(endTime).valueOf()
    ];

    input.map(function (item, i) {
      let tempName = name;
      tempName[i] = ethers.utils.formatBytes32String(item);
      setName([...tempName]);
    });

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccounts(accounts);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const factory = new ethers.ContractFactory(
      Ballot.abi,
      Ballot.data.bytecode.object,
      signer
    );

    const contract = await factory.deploy(...values, {
      value: ethers.utils.parseEther("0.15") // 0.1 eth plus 0.05 eth estimate gas fee for thansfer to winner
    });
    await contract.deployed();
    console.log(`Deployment successful! Contract Address: ${contract.address}`);
    alert(`Deployment successful! Contract Address: ${contract.address}`);
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <h5 className="title">Deploy Smart Contract</h5>
              </CardHeader>
              <Form onSubmit={handleSubmit}>
                <CardBody>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Candidate Name</label>
                        {input.map((element, index) => (
                          <div key={index}>
                            <Col md="12">
                              <Row>
                                <Input
                                  className="col-md-6"
                                  type="text"
                                  name="name"
                                  value={element}
                                  onChange={(e) => {
                                    let tempInput = input;
                                    tempInput[index] = e.target.value;
                                    setInput([...tempInput]);
                                  }}
                                />

                                {index ? (
                                  <Button
                                    type="button"
                                    className="button remove"
                                    onClick={() => {
                                      let tempInput = input;
                                      tempInput.splice(index, 1);
                                      setInput([...tempInput]);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                ) : null}
                              </Row>
                            </Col>
                          </div>
                        ))}
                        <br />
                        <Button
                          type="button"
                          className="button remove"
                          onClick={() => {
                            setInput([...input, ""]);
                          }}
                        >
                          Add
                        </Button>
                        <br />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Start Time</label>
                        <Input
                          className="col-md-6"
                          required
                          placeholder="Input your price"
                          type="datetime-local"
                          name="startTime"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>End Time</label>
                        <Input
                          className="col-md-6"
                          required
                          placeholder="Input your price"
                          type="datetime-local"
                          name="endTime"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  
                </CardBody>
                <CardFooter>
                  <Button className="btn-fill" color="primary" type="submit">
                    Deploy
                  </Button>
                </CardFooter>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Collection;
