document.addEventListener('DOMContentLoaded', function() {
  // Get gallery items from HTML
  const galleryItems = document.querySelectorAll('.gallery-item');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDescription = document.getElementById('lightbox-description');
  const lightboxArtistAvatar = document.getElementById('lightbox-artist-avatar');
  const lightboxArtistName = document.getElementById('lightbox-artist-name');
  const lightboxArtistLink = document.getElementById('lightbox-artist-link');
  const closeLightbox = document.querySelector('.close-lightbox');

  // Gallery item data for lightbox
  const itemData = {
    1: {
      title: 'Цветочная композиция',
      description: 'Нежная ботаническая татуировка с детализированными цветами. Выполнена в стиле блэкворк с тонкими линиями.',
      artist: {
        name: 'Алексей Морозов',
        avatar: 'content/alex.jpg',
        profile: 'artists.html?id=1'
      }
    },
    2: {
      title: 'Геометрический волк',
      description: 'Стилизованный волк, выполненный в геометрическом стиле с использованием только прямых линий. Минималистичный подход к традиционному сюжету.',
      artist: {
        name: 'Марина Соколова',
        avatar: 'content/marina.jpg',
        profile: 'artists.html?id=2'
      }
    },
    3: {
      title: 'Японский дракон',
      description: 'Традиционный японский дракон в стиле ирэдзуми. Работа выполнена с соблюдением канонов традиционной японской татуировки.',
      artist: {
        name: 'Илья Громов',
        avatar: 'content/ilya.jpg',
        profile: 'artists.html?id=3'
      }
    },
    4: {
      title: 'Кровавый лист',
      description: 'Реалистичный портрет, отличающийся высокой детализацией и плавными переходами. Работа выполнена с использованием разных оттенков серого и черного.',
      artist: {
        name: 'Алексей Морозов',
        avatar: 'content/alex.jpg',
        profile: 'artists.html?id=1'
      }
    },
    5: {
      title: 'Неотрадиционная роза',
      description: 'Яркая роза в неотрадиционном стиле. Сочетание насыщенных цветов и четких контуров создает современный взгляд на классический мотив.',
      artist: {
        name: 'Алексей Морозов',
        avatar: 'content/alex.jpg',
        profile: 'artists.html?id=1'
      }
    },
    6: {
      title: 'Орнаментальный рукав',
      description: 'Сложный геометрический орнамент, покрывающий всю руку. Татуировка выполнена в технике блэкворк с использованием различных узоров и текстур.',
      artist: {
        name: 'Марина Соколова',
        avatar: 'content/marina.jpg',
        profile: 'artists.html?id=2'
      }
    },
    7: {
      title: 'Олень с ветвями вместо рогов',
      description: 'Необычная композиция, сочетающая элементы пейзажа и абстракции. Работа отражает внутренний мир клиента через символические образы.',
      artist: {
        name: 'Илья Громов',
        avatar: 'content/ilya.jpg',
        profile: 'artists.html?id=3'
      }
    },
    8: {
      title: 'Огненный Феникс',
      description: 'Классическая татуировка в стиле олд скул. Работа ассоциируется с "перерождением" подобно Фентезийной птице.',
      artist: {
        name: 'Илья Громов',
        avatar: 'content/ilya.jpg',
        profile: 'artists.html?id=3'
      }
    },
    9: {
      title: 'Портрет питомца',
      description: 'Реалистичный портрет любимого домашнего животного. Тонкая проработка деталей, текстуры шерсти и выразительного взгляда.',
      artist: {
        name: 'Алексей Морозов',
        avatar: 'content/alex.jpg',
        profile: 'artists.html?id=1'
      }
    },
    10: {
      title: 'Цветущая сакура',
      description: 'Тонкие лепестки, плавно переходящие в тень от ветра.',
      artist: {
        name: 'Марина Соколова',
        avatar: 'content/marina.jpg',
        profile: 'artists.html?id=2'
      }
    },
    11: {
      title: 'Колесо Фортуны',
      description: 'Крупная детализированная мандала, покрывающая всю спину. Симметричные узоры образуют гармоничную композицию.',
      artist: {
        name: 'Алексей Морозов',
        avatar: 'content/alex.jpg',
        profile: 'artists.html?id=1'
      }
    },
    12: {
      title: 'Акварельные цветы',
      description: 'Нежная композиция из цветов, выполненная в технике имитации акварели. Плавные цветовые переходы и отсутствие чётких контуров создают эффект живописи.',
      artist: {
        name: 'Марина Соколова',
        avatar: 'content/marina.jpg',
        profile: 'artists.html?id=2'
      }
    }
  };

  // Filter gallery items by style
  function filterGallery(style) {
    galleryItems.forEach(item => {
      if (style === 'all' || item.getAttribute('data-style') === style) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Open lightbox with gallery item details
  function openLightbox(itemId, imageSrc, imageAlt) {
    const data = itemData[itemId];
    if (!data) return;

    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt;
    lightboxTitle.textContent = data.title;
    lightboxDescription.textContent = data.description;
    lightboxArtistAvatar.src = data.artist.avatar;
    lightboxArtistAvatar.alt = data.artist.name;
    lightboxArtistName.textContent = data.artist.name;
    lightboxArtistLink.href = data.artist.profile;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close lightbox
  function closeLightboxHandler() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Add event listeners to gallery items
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const itemId = item.getAttribute('data-id');
      const img = item.querySelector('img');
      openLightbox(itemId, img.src, img.alt);
    });
  });

  // Add event listeners to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      filterGallery(button.getAttribute('data-filter'));
    });
  });

  // Add event listeners for lightbox
  if (closeLightbox) {
    closeLightbox.addEventListener('click', closeLightboxHandler);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightboxHandler();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightboxHandler();
    }
  });
});