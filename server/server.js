const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {google} = require('googleapis');
const youtubeV3 = google.youtube({version: 'v3', auth: 'AIzaSyBd1_gIvpsqpufsZrFgJLhfkVFpNPN2ccU'});
const utils = require('./utils');

let mockData = require('./mock.json');

const app = express();
const port = process.env.PORT || 5000;

let youTubeSearchResults = [];
let youTubePageToken = null;
let youTubePagingCounter = 0;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/search', (req, res) => {

  youTubeSearchResults = [];
  youTubePageToken = null;
  youTubePagingCounter = 0;

  /* this is for mocking results to avoid youtube api quota exhaust too fast */
  /*
  getHowManyDays(mockData, req.body.maxMinutesSunToSat);
  res.send({
    videos: mockData,
    fiveMostFrequentWords: utils.getFiveMostFrequentWords(mockData),
    howManyDays: days.length
  });
  */

  getBunchOfVideos(req.body.searchTerm, youTubePageToken, result => {
    getHowManyDays(result, req.body.maxMinutesSunToSat);
    res.send({
      videos: result,
      fiveMostFrequentWords: utils.getFiveMostFrequentWords(result),
      howManyDays: days.length
    });
  })

});

let days = [];
let totalMinutesOnCurrentDay = 0;
let tempBucket = [];

const checkCurrentVideoLength = (indexVideoList, videosList, indexCurrentDay, maxMinutesSunToSat) => {
  let currentVideoLength = videosList[indexVideoList].snippet.durationMinutes;

  if (currentVideoLength > Math.max(...maxMinutesSunToSat)) {
    ++indexVideoList;
    if (indexVideoList < videosList.length) {
      checkCurrentVideoLength(indexVideoList, videosList, indexCurrentDay, maxMinutesSunToSat);
    }
  } else {

    if (currentVideoLength <= maxMinutesSunToSat[indexCurrentDay]) {
      if ((totalMinutesOnCurrentDay + currentVideoLength) <= maxMinutesSunToSat[indexCurrentDay]) {
        tempBucket.push(currentVideoLength);
        totalMinutesOnCurrentDay += currentVideoLength;
        ++indexVideoList;
        if (indexVideoList < videosList.length) {
          checkCurrentVideoLength(indexVideoList, videosList, indexCurrentDay, maxMinutesSunToSat);
        } else {
          days.push(tempBucket);
        }
      } else {
        days.push(tempBucket);
        tempBucket = [];
        totalMinutesOnCurrentDay = 0;
        ++indexCurrentDay;
        if (indexCurrentDay > 6) {
          indexCurrentDay = 0;
        }
        if (indexVideoList < videosList.length) {
          checkCurrentVideoLength(indexVideoList, videosList, indexCurrentDay, maxMinutesSunToSat);
        }
      }
      
    } else {
      days.push([]);
      ++indexCurrentDay;
      if (indexCurrentDay > 6) {
        indexCurrentDay = 0;
      }
      if (indexVideoList < videosList.length) {
        checkCurrentVideoLength(indexVideoList, videosList, indexCurrentDay, maxMinutesSunToSat);
      }
    }
  }
}

const getHowManyDays = (videosList, maxMinutesSunToSat) => {

  days = [];
  totalMinutesOnCurrentDay = 0;
  tempBucket = [];

  checkCurrentVideoLength(0, videosList, 0, maxMinutesSunToSat);
}

const youTubeDurationToMinutes = (youTubeDuration) => {
    const timeParser = /([0-9]*H)?([0-9]*M)?([0-9]*S)?$/;
    const parsed = timeParser.exec(youTubeDuration);
    const hours = parseInt(parsed[1], 10) || 0;
    const minutes = parseInt(parsed[2], 10) || 0;
    const seconds = parseInt(parsed[3], 10) || 0;
    const finalSeconds = (hours * 3600) + (minutes * 60) + (seconds);
    return Math.ceil(finalSeconds / 60);
}

const getBunchOfVideos = (searchTerm, youTubePageToken, callback) => {
  youtubeV3.search.list({
    pageToken: youTubePageToken,
    part: 'snippet',
    type: 'video',
    q: searchTerm,
    maxResults: 50,
    order: 'date',
    safeSearch: 'moderate',
    videoEmbeddable: true
  }, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      youTubePagingCounter++;
      youTubePageToken = response.data.nextPageToken;

      let ids = response.data.items.map(item => {
        return item.id.videoId;
      })

      getVideoDetail(ids, function(details) {

        let contentDetails = details.data.items.map(content => {
          return content.contentDetails;
        })

        for (var i = 0; i < response.data.items.length; i++) {
          if (contentDetails[i]) {
            response.data.items[i].snippet.duration = contentDetails[i].duration;
            response.data.items[i].snippet.durationMinutes = youTubeDurationToMinutes(contentDetails[i].duration);            
          } else {
            response.data.items[i].snippet.duration = '';
            response.data.items[i].snippet.durationMinutes = 0;                        
          }
        }

        youTubeSearchResults = youTubeSearchResults.concat(response.data.items);

        if (youTubePagingCounter > 3) {
          callback(youTubeSearchResults);
        } else {
          if (response.data.items.length < 50) {
            callback(youTubeSearchResults);
          } else {
            getBunchOfVideos(searchTerm, youTubePageToken, callback);            
          }
        }

      });
    }
  });
}

const getVideoDetail = (ids, callback) => {
  youtubeV3.videos.list({
    part: 'contentDetails',
    id: ids
  }, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      callback(response);
    }
  });
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
