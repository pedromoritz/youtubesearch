import React, { Component } from 'react';
import VideoList from './components/video_list'

import './App.css';

class App extends Component {
  state = {
    response: '',
    searchTerm: '',
    data: '',
    size: '-',
    videos: [],
    rawBody: '',
    howManyDays: '-',
    fiveMostFrequentWords: '-',
    loading: false,
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

    this.setState({ howManyDays: '-' });
    this.setState({ fiveMostFrequentWords: '-' });
    this.setState({ size: '-' });
    this.setState({ loading: true });
    this.setState({ videos: [] });

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

    this.setState({ loading: false });

    let bodyObj = JSON.parse(body);
    this.setState({ size: bodyObj.videos.length });
    this.setState({ fiveMostFrequentWords: bodyObj.fiveMostFrequentWords });
    this.setState({ howManyDays: bodyObj.howManyDays });
    this.setState({ rawBody: body });
    this.setState({ videos: bodyObj.videos });
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

          Max Sunday Minutes:&nbsp; 
          <input 
            type="number"
            value={this.state.maxSunMinutes}
            onChange={e => this.setState({ maxSunMinutes: e.target.value })}
          />
          <br /><br />

          Max Monday Minutes:&nbsp; 
          <input 
            type="number"
            value={this.state.maxMonMinutes}
            onChange={e => this.setState({ maxMonMinutes: e.target.value })}
          />
          <br /><br />

          Max Tuesday Minutes:&nbsp; 
          <input 
            type="number"
            value={this.state.maxTueMinutes}
            onChange={e => this.setState({ maxTueMinutes: e.target.value })}
          />
          <br /><br />

          Max Wednesday Minutes:&nbsp; 
          <input 
            type="number"
            value={this.state.maxWedMinutes}
            onChange={e => this.setState({ maxWedMinutes: e.target.value })}
          />
          <br /><br />

          Max Thursday Minutes:&nbsp; 
          <input 
            type="number"
            value={this.state.maxThuMinutes}
            onChange={e => this.setState({ maxThuMinutes: e.target.value })}
          />
          <br /><br />

          Max Friday Minutes:&nbsp; 
          <input 
            type="number"
            value={this.state.maxFriMinutes}
            onChange={e => this.setState({ maxFriMinutes: e.target.value })}
          />
          <br /><br />

          Max Saturday Minutes:&nbsp; 
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
        {this.state.loading ? <span>Loading...</span> : <span>&nbsp;</span>}
        <br />
          <b>Videos found:</b><br />
          {this.state.size}<br /><br />
        </p>
        <p>
          <b>Five most used words in titles and descriptions of the result:</b><br />
          {this.state.fiveMostFrequentWords}<br /><br />
        </p>
        <p>
          <b>How many days are needed to watch all the vídeos returned:</b><br />
          {this.state.howManyDays}<br /><br />
        </p>
        <VideoList videos={this.state.videos} />
      </div>
    );
  }
}

export default App;
