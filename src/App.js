import React from 'react';
import './App.css';
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

var sections = [];
var yellowCell = '#9bbb59';
var redCell = "#c0504d";
var blueCell = "#4f81bd";

export default class sectionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowCount: '',
      columnCount: '',
      bookingId: 1,
      numberOfPaassangers: '',
      availableSlots: 0
    }

    this.handleChange = this.handleChange.bind(this);
    this.createSectionContent = this.createSectionContent.bind(this);
    this.renderSeatView = this.renderSeatView.bind(this);
  }

  handleChange(event) {
    var key = event.target.name;
    if (key === 'rowCount')
      this.setState({ rowCount: event.target.value });
    else if (key === 'columnCount')
      this.setState({ columnCount: event.target.value });
    else if (key === 'numberOfPaassangers')
      this.setState({ numberOfPaassangers: event.target.value });
  }


  addNewSection = (event) => {
    event.preventDefault();
    let rowCount = this.state.rowCount;
    let columnCount = this.state.columnCount;
    // if(this.state.rowCount)

    let sectionsCount = sections.length;

    let sectionArray = new Array(rowCount);
    for (var i = 0; i < rowCount; i++) {
      sectionArray[i] = [];
      for (var j = 0; j < columnCount; j++) {

        let priority = 3;
        if (j === (columnCount - 1)) {
          priority = 1;
        }
        if (j === 0) {
          if (sectionsCount === 0)
            priority = 2;
          else
            priority = 1;
        }
        if (j === (columnCount - 1)) {
          priority = 2
        }


        let sectionMap = {
          color: this.getColorFromPriority(priority),
          value: '',
          priority: priority
        }
        sectionArray[i].push(sectionMap);



      }
    }
    if (sectionsCount > 0) {
      let sectionArray = sections[sections.length - 1];
      for (let section of sectionArray) {
        section[section.length - 1].color = blueCell;
        section[section.length - 1].priority = 1;
      }
    }


    sections.push(sectionArray)
    this.renderSeatView();

    let availableSlots = this.state.availableSlots;
    availableSlots = availableSlots + (rowCount * columnCount);
    this.setState({ availableSlots: availableSlots });

    this.setState({ rowCount: '' });
    this.setState({ columnCount: '' });
  }

  getColorFromPriority(priority) {
    switch (priority) {
      case 1: return blueCell;
      case 2: return yellowCell;
      case 3: return redCell;
      default: return redCell;
    }
  }

  createSectionContent() {
    return (
      <div>
        {sections.map(function (sectionArray) {
          return (
            <div class="sectionContainer">
              <div class="sectionDiv">
                {
                  sectionArray.map(function (section) {
                    return (
                      <div>
                        {
                          section.map(function (cell) {
                            return (
                              <div class="cell" style={{ background: cell.color }}> {cell.value ? cell.value : '-'} </div>
                            )
                          })
                        }

                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        })
        }
      </div>
    );
  }

  bookNewSlot = (event) => {
    event.preventDefault();
    let numberOfPaassangers = this.state.numberOfPaassangers;
    if (!numberOfPaassangers) {
      alert("Enter a valid assanger count");
      return;
    }
    let availableSlots = this.state.availableSlots;
    if (numberOfPaassangers > availableSlots) {
      alert("Passanger count must be less than the available seat capacity");
      return;
    }
    for (let passangerIndex = 0; passangerIndex < numberOfPaassangers; passangerIndex++) {
      setTimeout(() => { this.bookForAPassanger() }, 500);

    }
    availableSlots = availableSlots - numberOfPaassangers;
    this.setState({ availableSlots: availableSlots });
    this.setState({ numberOfPaassangers: '' });

  }

  bookForAPassanger = () => {
    let prioritySet = [1, 2, 3];
    for (let priority of prioritySet) {
      if (this.bookAccordingToPriority(priority)) {
        return true;
      }
    }
    return false;
  }

  bookAccordingToPriority(priority) {

    let numberOfMaximumRows = 0;
    for (let sectionArray of sections) {
      if (sectionArray.length > numberOfMaximumRows) {
        numberOfMaximumRows = sectionArray.length;
      }
    };

    for (let row = 0; row < numberOfMaximumRows; row++) {
      for (let sectionArray of sections) {
        let sections = sectionArray[row];
        if (sections && sections.length) {
          for (let cell of sections) {

            if (cell.priority === priority && cell.value === '') {
              let bookingId = this.state.bookingId;
              cell.value = bookingId;
              this.setState({ bookingId: bookingId + 1 });
              let sectionContent = this.createSectionContent();
              ReactDOM.render(sectionContent, document.getElementById('seatArrangements'));
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  renderSeatView = () => {
    let sectionContent = this.createSectionContent();
    ReactDOM.render(sectionContent, document.getElementById('seatArrangements'));
  }

  render() {
    return (
      <Container fluid>
        <div class="pageContainer">
          <Row>
            <Col >
              <div class="heading">
                Flyt Booking System
            </div>
            </Col>
          </Row>
          <div class="contentSection">
            <div class="inputSection">
              <Row>
                <Col md={4} sm={4}>
                  <Form onSubmit={this.addNewSection}>
                    <Row>
                      <Col md={12}>Enter Section details to be added</Col>
                      <Col md={4} sm={4}>
                        <Form.Group >
                          <Form.Control type="number" value={this.state.rowCount} name='rowCount' placeholder="Rows"
                            onChange={this.handleChange} required />
                        </Form.Group>
                      </Col>
                      <Col md={4} sm={4}>
                        <Form.Group >
                          <Form.Control name='columnCount' type="number" value={this.state.columnCount} placeholder="Columns"
                            onChange={this.handleChange} required />
                        </Form.Group>
                      </Col>
                      <Col md={4} sm={4}>
                        <Button variant="primary" type="submit" >Submit </Button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
                <Col>
                  <div class="booking">
                    <div>Current Booking Number: {this.state.bookingId} </div>
                    <div>Remaining Slots: {this.state.availableSlots}</div>
                  </div>
                </Col>
                <Col md={4} sm={4}>
                  <Form onSubmit={this.bookNewSlot}>
                    <Row>
                      <Col sm={12}>
                        Enter number of passangers to fill
                      </Col>
                      <Col sm={8}>
                        <Form.Group >
                          <Form.Control type="number" value={this.state.numberOfPaassangers} name='numberOfPaassangers'
                            placeholder="Number Of Paassangers" onChange={this.handleChange} required />
                        </Form.Group>
                      </Col>
                      <Col sm={4}>
                        <Button type="submit" class="book" id="bookingButton">Fill </Button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </div>
            <Row>
              <Col>
                <div id="seatArrangements"></div>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    );
  }



}


