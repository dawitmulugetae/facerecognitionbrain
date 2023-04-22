import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particle from './components/Particle/Particle';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'

const PAT = '3ea394cf64194d3bae0916e881ecc40d';
const USER_ID = 'clarifai';       
const APP_ID = 'main';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    





class App extends Component {
  constructor() {
    super();
    this.state = {
      imageUrl: '',
      input: ''
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
    this.setState({imageUrl: this.state.input})
  }
  images = () => {
    
  }
  onButtonSubmit = async () => {
    this.setState({imageUrl: this.state.input})
    let raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": this.state.input
                  }
              }
          }
      ]
    });
    
    let requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
    };
    
    await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result.outputs[0].data.regions[0].region_info.bounding_box)
    })
    .catch(error => console.log('error', error));
  
  }
  render() {
    const { imageUrl } = this.state;
    
    return (
      <div className="App">
        <Particle/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition imageUrl={imageUrl}/>

      </div>
    );
  }

}

export default App;
