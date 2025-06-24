document.addEventListener('DOMContentLoaded', function() {
  // Artists data
  const artistsData = {
    1: {
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
    2: {
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
    3: {
      name: 'Илья Громов',
      specialty: 'Традишнл, Орнаменты',
      bio: 'Мастер традиционных стилей татуировки с 8-летним опытом. Особенно увлекаюсь японской и американской традиционной татуировкой, изучал историю и культурный контекст этих направлений. Каждая моя работа — это не только изображение, но и история, рассказанная через символы и традиционные элементы. Придаю большое значение чистым линиям и насыщенным цветам.',
      styles: ['Традишнл', 'Японский стиль', 'Олд скул', 'Орнаменты'],
      avatar: 'content/ilya.jpg',
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
  };

  const artistCards = document.querySelectorAll('.artist-card');
  const artistModal = document.getElementById('artist-modal');
  const closeModal = document.querySelector('.close-modal');

  // Open artist modal with details
  function openArtistModal(artistId) {
    const artist = artistsData[artistId];
    if (!artist) return;

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

  // Add event listeners to artist cards
  artistCards.forEach(card => {
    card.addEventListener('click', () => {
      const artistId = card.getAttribute('data-id');
      openArtistModal(artistId);
    });
  });

  // Add event listeners for modal
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
    if (e.key === 'Escape' && artistModal && artistModal.classList.contains('active')) {
      closeModalHandler();
    }
  });

  // Check for artist ID in URL
  function checkForArtistInURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get('id');
    
    if (artistId && artistsData[artistId]) {
      setTimeout(() => {
        openArtistModal(artistId);
      }, 500);
    }
  }

  // Check URL for artist ID
  checkForArtistInURL();
});