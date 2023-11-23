import axios from 'axios';

type TODO = {
  id: number;
  name: string;
  description: string;
};

const showAndHide2 = (el: HTMLDivElement) => {
  if (el.classList.contains('d-none')) {
    el.classList.remove('d-none');
  } else {
    el.classList.add('d-none');
  }
};

function generateCards(res: TODO[]) {
  const cardContainer = document.querySelector<HTMLDivElement | null>('#card-container');
  res.forEach((artist) => {
    const card = document.createElement('article');
    card.classList.add('artistCard__Wrapper');
    card.innerHTML = `
            <div class="card-wrapper">
                <div class="section image-section">
                    <figure class="image card__image">
                        <img  src="https://picsum.photos/id/${artist.id + 10}/200/200?grayscale">
                    </figure>
                </div>
                <div class="artist-content">
                    <div class="section heading-section">
                        <h2>${artist.name}</h2>
                    </div>
                    <div class="section description-section">
                        <p>Description: ${artist.description}</p>
                    </div>
                    <div class="section btn-section">
                        <div class="btn-section__edit action-btn">
                            <button class="edit-artist" id= "edit-${artist.id}">Edit artist</button>
                        </div>
                        <div class="btn-section__delete action-btn">
                            <button class="delete-artist" id= "${artist.id}">Delete artist</button>
                        </div> 
                    </div>
                    <div class="section edit-form-section-${artist.id} d-none">
                            <input class="input" id="edit-artist-name-${artist.id}" type="text" placeholder="${artist.name}" required>
                            <div class="validation-error" id="msg3"></div>
                            <textarea class="textarea" id="edit-artist-description-${artist.id}" placeholder="${artist.description}" required></textarea>
                            <div class="validation-error" id="msg4"></div>
                            <input class="button edit-new-artist" id="edit-artist-submit-${artist.id}" type="submit" value="Update artist">
                            </div>
                    </div>
                </div>
          </article>`;
    ///
    cardContainer.appendChild(card);
  });

  // delete artist
  // edit artist
  res.forEach((artist) => {
    const deleteArtistButton = document.getElementById(`${artist.id}`);
    deleteArtistButton.addEventListener('click', () => {
      axios.delete<TODO>(`http://localhost:3004/artists/${artist.id}`);
      window.location.reload();
    });

    const editArtistButton = document.getElementById(`edit-${artist.id}`);
    const editArtistSubmitButton = document.getElementById(`edit-artist-submit-${artist.id}`);
    const editArtistName = document.querySelector<HTMLFormElement | null>(`#edit-artist-name-${artist.id}`);
    const editArtistDescription = document.querySelector<HTMLFormElement | null>(`#edit-artist-description-${artist.id}`);
    const editForm = document.querySelector<HTMLDivElement | null>(`.edit-form-section-${artist.id}`);
    const msg3 = document.getElementById('msg3');
    const msg4 = document.getElementById('msg4');

    editArtistButton.addEventListener('click', () => {
      showAndHide2(editForm);
    });
    editArtistSubmitButton.addEventListener('click', () => {
      // formValidation
      if (editArtistName.value === '') {
        msg3.innerHTML = 'Artist cannot be blank';
      } else if (editArtistDescription.value === '') {
        msg4.innerHTML = 'Artist cannot be blank';
      } else {
        axios.put<TODO>(`http://localhost:3004/artists/${artist.id}`, {
          name: editArtistName.value,
          description: editArtistDescription.value,
        });
        window.location.reload();
      }
    });
  });
}

// create artist
axios.get<TODO[]>('http://localhost:3004/artists')
  .then(({ data }) => {
    generateCards(data);
  });

// add new artist
const addNewShowButton = document.querySelector<HTMLButtonElement | null>('.action-btn__add-new');
const formContainer = document.querySelector<HTMLDivElement | null>('.form-container');
addNewShowButton.addEventListener('click', () => {
  showAndHide2(formContainer);
});

const addNewArtistHeading = document.querySelector<HTMLFormElement | null>('.input');
const addNewArtistDescription = document.querySelector<HTMLFormElement | null>('.textarea');
const addNewArtistButton = document.querySelector<HTMLButtonElement | null>('.add-new-artist');
const msg1 = document.getElementById('msg1');
const msg2 = document.getElementById('msg2');

addNewArtistButton.addEventListener('click', () => {
  // formValidation
  if (addNewArtistHeading.value === '') {
    msg1.innerHTML = 'Artist cannot be blank';
  } else if (addNewArtistDescription.value === '') {
    msg2.innerHTML = 'Artist cannot be blank';
  } else {
    msg1.innerHTML = '';
    msg2.innerHTML = '';
    axios.post<TODO>('http://localhost:3004/artists', {
      name: addNewArtistHeading.value,
      description: addNewArtistDescription.value,
    });
    window.location.reload();
  }
});
