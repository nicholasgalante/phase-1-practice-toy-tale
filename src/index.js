let addToy = false;

document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector('#toy-collection');
  const form = document.querySelector('.add-toy-form');


  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  function updateToys(){
    toyCollection.innerHTML = '';
    fetch('http://localhost:3000/toys')
      .then(res => res.json())
      .then(allToyObjs => {
        allToyObjs.forEach(toyObj => {
          const card = document.createElement('div')
          const h2 = document.createElement('h2');
          const img = document.createElement('img');
          const p = document.createElement('p');
          const bttn = document.createElement('button');
          bttn.addEventListener('click', updateLikeCount);

          card.setAttribute('class', 'card');
          img.setAttribute('src', toyObj.image);
          img.setAttribute('class', 'toy-avatar');
          bttn.setAttribute('class', 'like-btn');
          bttn.setAttribute('id', toyObj.id);
          h2.innerText = toyObj.name;
          p.innerText = `${toyObj.likes} likes`;
          bttn.innerText = 'Like';

          card.append(h2);
          card.append(img);
          card.append(p);
          card.append(bttn);

          toyCollection.append(card);
        });
      })
  }
  updateToys();

  form.addEventListener('submit', event => {
    event.preventDefault();
    let name = form.elements['name'].value;
    let image = form.elements['image'].value;
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        "name": name,
        "image": image,
        "likes": "0",
      })
    })
    .then(updateToys)
    form.reset();
  });

});

updateLikeCount = (e) => {
  let id = e.target.id;
  let currLikes = parseInt(e.target.previousSibling.innerText);
  let newLikes = currLikes + 1;

  fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      "likes": newLikes
    })
  })
  .then(res => res.json())
  .then(toyObj => {
    e.target.previousSibling.innerText = `${toyObj.likes} likes`;
    });
}


