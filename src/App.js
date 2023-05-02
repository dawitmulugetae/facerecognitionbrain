import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import cors from 'cors';
   

const initialState = {
  imageUrl: '',
  input: '',
  box: {},
  route: 'signin',
  isSignedin: false,
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: ''
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

 loadUser = (data) => {
  this.setState({
    user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }
  })
 }
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      rightCol: width - (clarifaiFace.right_col * width),
      topRow: clarifaiFace.top_row * height,
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value})
    this.setState({imageUrl: this.state.input})
  }

  onButtonSubmit = async () => {
    this.setState({imageUrl: this.state.input})
    fetch('https://smart-brain-api-8sle.onrender.com/imageurl', {
      method: 'post',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
        input: this.state.input,
    })
    })
    .then(response => response.json())
    .then(result => {
      if (result) {
        fetch('https://smart-brain-api-8sle.onrender.com/image', {
          method: 'put',
          headers: {
            'Content-Type' : 'application/json',
            'Acess-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            id: this.state.user.id,
        })
      }).then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, {entries: count}))
      })
    }
      this.displayFaceBox(this.calculateFaceLocation(result)) })
    .catch(error => console.log('error', error));

  
  }
  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState)
    } else if(route === 'home') {
      this.setState({isSignedin: true})
    }
    this.setState({route: route})
  }

  render() {
    const { imageUrl, box, isSignedin, user } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="circle" bg={true} className="particles"/>
        <Navigation isSignedin={isSignedin} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home'
          
          ? <div>
              <Logo />
              <Rank name={user.name} entries={user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          :( this.state.route === 'signin'
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
           ) 
        }
      </div>
    );
  }

}

export default App;
