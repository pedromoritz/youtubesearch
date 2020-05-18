exports.getFiveMostFrequentWords = (videosList) => {
  let words = [];

  for (var i = 0; i < videosList.length; i++) {
    words = words.concat(videosList[i].snippet.description.split(/\s+/));
    words = words.concat(videosList[i].snippet.title.split(/\s+/));
  }

  let wordsMap = this.mappingWords(words);
  let finalWordsArray = this.sortByCount(wordsMap);
  let fiveMostFrequentWords = finalWordsArray.slice(0, 5);

  let finalReadable = fiveMostFrequentWords.map(function(item) {
    return `${item.word} (${item.total})`;
  })

  return finalReadable.join(', ');
}

exports.mappingWords = (words) => {
  let wordsMap = {};

  words.forEach(word => {
    let cleanedWord = word.toLowerCase().replace(/[^a-z0-9\u00C0-\u024F\u1E00-\u1EFF+]+/gi, '');

    if (cleanedWord) {
      if (wordsMap.hasOwnProperty(cleanedWord)) {
        wordsMap[cleanedWord]++;
      } else {
        wordsMap[cleanedWord] = 1;
      } 
    }
  });

  return wordsMap;
}

exports.sortByCount = (wordsMap) => {
  var finalWordsArray = [];

  finalWordsArray = Object.keys(wordsMap).map(function (key) {
    return {
      word: key,
      total: wordsMap[key]
    };
  });

  finalWordsArray.sort(function (a, b) {
    return b.total - a.total;
  });

  return finalWordsArray;
}
