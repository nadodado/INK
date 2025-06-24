document.addEventListener('DOMContentLoaded', function() {
  // Artists data - In a real application, this would come from a server
  const artists = [
    {
      id: 1,
      name: 'Алексей Морозов',
      specialty: 'Реализм, Блэкворк',
      bio: 'Более 10 лет опыта в татуировке. Специализируюсь на реалистичных портретах и детализированных блэкворк работах. Каждую татуировку рассматриваю как уникальное произведение искусства, адаптированное под индивидуальность клиента. Постоянно совершенствую технику и слежу за новыми тенденциями в мире тату.',
      styles: ['Реализм', 'Блэкворк', 'Портреты', 'Графика'],
      avatar: 'content/alex.jpg',
      socials: {
        vk: 'https://vk.com',
        telegram: 'https://t.me/username'
      },
      portfolio: [
        'content/flower.jpg',
        'content/blodyleaves.jpg',
        'content/roza.jpg',
        'content/buddy.jpg',
      ]
    },
    {
      id: 2,
      name: 'Марина Соколова',
      specialty: 'Графика, Неотрадишнл',
      bio: 'Художник с образованием в области графического дизайна. В татуировке уже 7 лет, за это время разработала свой уникальный стиль на стыке графики и неотрадишнл. Люблю экспериментировать с формами и композициями, создавая динамичные и выразительные работы. Всегда открыта для творческих идей и коллабораций с клиентами.',
      styles: ['Графика', 'Неотрадишнл', 'Орнаменты', 'Геометрия'],
      avatar: 'content/marina.jpg',
      socials: {
        vk: 'https://vk.com',
        telegram: 'https://t.me/username'
      },
      portfolio: [
        'content/wolve.jpg',
        'content/rukav.jpg',
        'content/sakura.jpg',
        'content/flower.jpg'
      ]
    },
    {
      id: 3,
      name: 'Илья Громов',
      specialty: 'Традишнл, Орнаменты',
      bio: 'Мастер традиционных стилей татуировки с 8-летним опытом. Особенно увлекаюсь японской и американской традиционной татуировкой, изучал историю и культурный контекст этих направлений. Каждая моя работа — это не только изображение, но и история, рассказанная через символы и традиционные элементы. Придаю большое значение чистым линиям и насыщенным цветам.',
      styles: ['Традишнл', 'Японский стиль', 'Олд скул', 'Орнаменты'],
      avatar: 'ilya.jpg',
      socials: {
        vk: 'https://vk.com',
        telegram: 'https://t.me/username'
      },
      portfolio: [
        'content/drakon.jpg',
        'content/deer.jpg',
        'content/fenix.jpg'
      ]
    }
  ];

  const artistsContainer = document.getElementById('artists-container');
  const artistModal = document.getElementById('artist-modal');
  const closeModal = document.querySelector('.close-modal');

  // Generate artist cards
  function renderArtists() {
    artistsContainer.innerHTML = '';

    artists.forEach(artist => {
      const artistCard = document.createElement('div');
      artistCard.className = 'artist-card';
      artistCard.setAttribute('data-id', artist.id);
      
      // Get sample works (first 4)
      const sampleWorks = artist.portfolio.slice(0, 4);
      
      artistCard.innerHTML = `
        <div class="artist-header">
          <div class="artist-avatar-container">
            <img src="${artist.avatar}" alt="${artist.name}">
          </div>
          <h3 class="artist-name">${artist.name}</h3>
          <p class="artist-specialty">${artist.specialty}</p>
          <div class="artist-tags">
            ${artist.styles.slice(0, 3).map(style => `<span class="artist-tag">${style}</span>`).join('')}
          </div>
        </div>
        <div class="artist-sample">
          ${sampleWorks.map(work => `
            <div class="sample-work">
              <img src="${work}" alt="Пример работы">
            </div>
          `).join('')}
        </div>
        <div class="artist-footer">
          <a href="#" class="view-profile-btn">Профиль мастера</a>
        </div>
      `;
      
      artistCard.addEventListener('click', () => {
        openArtistModal(artist);
      });
      
      artistsContainer.appendChild(artistCard);
    });
  }

  // Open artist modal with details
  function openArtistModal(artist) {
    const modalArtistAvatar = document.getElementById('modal-artist-avatar');
    const modalArtistName = document.getElementById('modal-artist-name');
    const modalArtistSpecialty = document.getElementById('modal-artist-specialty');
    const modalArtistVK = document.getElementById('modal-artist-vk');
    const modalArtistTG = document.getElementById('modal-artist-tg');
    const modalArtistBio = document.getElementById('modal-artist-bio');
    const modalArtistStyles = document.getElementById('modal-artist-styles');
    const modalArtistPortfolio = document.getElementById('modal-artist-portfolio');

    modalArtistAvatar.src = artist.avatar;
    modalArtistAvatar.alt = artist.name;
    modalArtistName.textContent = artist.name;
    modalArtistSpecialty.textContent = artist.specialty;
    modalArtistVK.href = artist.socials.vk;
    modalArtistTG.href = artist.socials.telegram;
    modalArtistBio.textContent = artist.bio;

    // Render styles
    modalArtistStyles.innerHTML = '';
    artist.styles.forEach(style => {
      const styleTag = document.createElement('span');
      styleTag.className = 'style-tag';
      styleTag.textContent = style;
      modalArtistStyles.appendChild(styleTag);
    });

    // Render portfolio
    modalArtistPortfolio.innerHTML = '';
    artist.portfolio.forEach(work => {
      const portfolioItem = document.createElement('div');
      portfolioItem.className = 'portfolio-item';
      portfolioItem.innerHTML = `<img src="${work}" alt="Работа мастера">`;
      modalArtistPortfolio.appendChild(portfolioItem);
    });

    artistModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close artist modal
  function closeModalHandler() {
    artistModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Add event listeners
  if (closeModal) {
    closeModal.addEventListener('click', closeModalHandler);
  }

  if (artistModal) {
    artistModal.addEventListener('click', function(e) {
      if (e.target === artistModal) {
        closeModalHandler();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && artistModal.classList.contains('active')) {
      closeModalHandler();
    }
  });

  // Check for artist ID in URL
  function checkForArtistInURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get('id');
    
    if (artistId) {
      const artist = artists.find(a => a.id === parseInt(artistId));
      if (artist) {
        setTimeout(() => {
          openArtistModal(artist);
        }, 500);
      }
    }
  }

  // Initialize artists
  renderArtists();
  
  // Check URL for artist ID
  checkForArtistInURL();
});