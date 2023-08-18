import { catsData } from "./data.js";

// DOMs

const radiosDiv = document.getElementById('radios-div');
const gifCheckBox = document.getElementById('gif-checkbox');
const memeContainer = document.getElementById('meme-container');
const btnEl = document.getElementById('get-btn');
const checkboxContainer = document.getElementById('checkbox-container');

function getEmotionsArray(cats) {
  const emotionsArray = [];
  for (let cat of cats) {
    for (let emotion of cat.emotionTags) {
      if (emotionsArray.includes(emotion)) {
        continue;
      } else {
        emotionsArray.push(emotion);
      }
    }
  }
  return emotionsArray;
}
let el = ''
function renderEmotions(cats) {
  const emotionsArray = getEmotionsArray(cats);
  for (let emotion of emotionsArray) {
    el += `
      <div class="radio">
        <label for="${emotion}">${emotion}</label>
        <input type="radio" id="${emotion}" name="radios" value="${emotion}">
      </div>
    `;
  }
  radiosDiv.innerHTML = el;
}

renderEmotions(catsData);

// EVENT LISTENERS

// When the radio gets highlighted

radiosDiv.addEventListener('change', highlighter);

function highlighter(e) {
  const radio = document.getElementsByClassName('radio');
  for (let each of radio) {
    each.classList.remove('highlight');
  }
  document.getElementById(e.target.id).parentElement.classList.add('highlight');
}

// Listening for when the button is clicked

btnEl.addEventListener('click', function() {
  render(catsData);
  document.querySelector('.meme-image').style.display = 'flex';
  checkboxContainer.style.display ='none'
  btnEl.style.marginTop = '20px'
});

// Listening for the memeContainer to be clicked to make the meme disappear and allow other selections without refreshing the page
memeContainer.addEventListener('dblclick', function() {
  document.querySelector('.meme-image').style.display = 'none';
  checkboxContainer.style.display = 'block'
  btnEl.textContent = 'Get Image';
  btnEl.style.display = 'inline-block';
  btnEl.style.marginTop = '0'
  radiosDiv.innerHTML = '';
  radiosDiv.innerHTML = el;
});

// To get the cats object that matches the selected radio or both the gif and the radio
function getMatchingList(cats) {
  const hasGif = gifCheckBox.checked;
  let matchingList = [];
  if (document.querySelector('input[type="radio"]:checked')) {
    matchingList = cats.filter(function(cat) {
      if (hasGif) {
        return cat.isGif && cat.emotionTags.includes(document.querySelector('input[type="radio"]:checked').value);
      } else {
        return cat.emotionTags.includes(document.querySelector('input[type="radio"]:checked').value) && !cat.isGif;
      }
    });
  }
  return matchingList;
}

// To get only one object randomly from the matching list
function onePicker(cats) {
  let array = getMatchingList(cats);
  if (array.length > 1) {
    btnEl.textContent = "Next";
  } else {
    btnEl.style.display = 'none';
  }
  let rand = Math.floor(Math.random() * array.length);
  return array[rand];
}

// To render

function render(cats) {
  let obj = onePicker(cats);
  memeContainer.innerHTML = `
    <img Title = "Double click to cancel" src="images/${obj.image}" alt="${obj.alt}">
  `;
}