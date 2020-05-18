import React, { Component } from 'react';
import VideoList from './components/video_list'

import './App.css';

class App extends Component {
  state = {
    response: '',
    searchTerm: '',
    data: '',
    size: 0,
    videos: [],
    rawBody: '',
    maxSunMinutes: 0,
    maxMonMinutes: 0,
    maxTueMinutes: 0,
    maxWedMinutes: 0,
    maxThuMinutes: 0,
    maxFriMinutes: 0,
    maxSatMinutes: 0
  };

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        searchTerm: this.state.searchTerm,
        maxMinutesSunToSat: [
          parseInt(this.state.maxSunMinutes),
          parseInt(this.state.maxMonMinutes),
          parseInt(this.state.maxTueMinutes),
          parseInt(this.state.maxWedMinutes),
          parseInt(this.state.maxThuMinutes),
          parseInt(this.state.maxFriMinutes),
          parseInt(this.state.maxSatMinutes)
        ]
      }),
    });
    const body = await response.text();

    let bodyObj = JSON.parse(body);
    this.setState({ size: bodyObj.videos.length });
    this.setState({ fiveMostFrequentWords: bodyObj.fiveMostFrequentWords });
    this.setState({ howManyDays: bodyObj.howManyDays });
    //this.setState({ rawBody: body });
    //this.setState({ videos: JSON.parse(body) });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            YouTube Search
          </p>
        </header>
        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>YouTube Search</strong>
          </p>

          Max Sun Minutes:&nbsp; 
          <input 
            type="number"
            value={this.state.maxSunMinutes}
            onChange={e => this.setState({ maxSunMinutes: e.target.value })}
          />
          <br /><br />

          Max Mon Minutes:&nbsp; 
          <input 
            type="number"
            value={this.state.maxMonMinutes}
            onChange={e => this.setState({ maxMonMinutes: e.target.value })}
          />
          <br /><br />

          Max Tue Minutes:&nbsp; 
          <input 
            type="number"
            value={this.state.maxTueMinutes}
            onChange={e => this.setState({ maxTueMinutes: e.target.value })}
          />
          <br /><br />

          Max Wed Minutes:&nbsp; 
          <input 
            type="number"
            value={this.state.maxWedMinutes}
            onChange={e => this.setState({ maxWedMinutes: e.target.value })}
          />
          <br /><br />

          Max Thu Minutes:&nbsp; 
          <input 
            type="number"
            value={this.state.maxThuMinutes}
            onChange={e => this.setState({ maxThuMinutes: e.target.value })}
          />
          <br /><br />

          Max Fri Minutes:&nbsp; 
          <input 
            type="number"
            value={this.state.maxFriMinutes}
            onChange={e => this.setState({ maxFriMinutes: e.target.value })}
          />
          <br /><br />

          Max Sat Minutes:&nbsp; 
          <input 
            type="number"
            value={this.state.maxSatMinutes}
            onChange={e => this.setState({ maxSatMinutes: e.target.value })}
          />
          <br /><br />

          <input
            type="text"
            value={this.state.searchTerm}
            onChange={e => this.setState({ searchTerm: e.target.value })}
          />&nbsp;

          <button type="submit">Search</button>
        </form>
        <p>
          <b>Five most used words in titles and descriptions of the result:</b><br />
          {this.state.fiveMostFrequentWords}<br /><br />
        </p>
        <p>
          <b>How many days are needed to watch all the vídeos returned:</b><br />
          {this.state.howManyDays}<br /><br />
        </p>
        <p>{this.state.size}</p>
        <p>{this.state.rawBody}</p>
        <VideoList 
          videos={this.state.videos} />
      </div>
    );
  }
}

export default App;
