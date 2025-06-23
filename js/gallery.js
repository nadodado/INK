document.addEventListener('DOMContentLoaded', function() {
  // Gallery data - In a real application, this would come from a server
  const galleryItems = [
    {
      id: 1,
      title: 'Цветочная композиция',
      description: 'Нежная ботаническая татуировка с детализированными цветами. Выполнена в стиле блэкворк с тонкими линиями.',
      image: 'content/flower.jpg',
      style: 'blackwork',
      artist: {
        id: 1,
        name: 'Алексей Морозов',
        avatar: 'content/alex.jpg',
        profile: 'artists.html?id=1'
      }
    },
    {
      id: 2,
      title: 'Геометрический волк',
      description: 'Стилизованный волк, выполненный в геометрическом стиле с использованием только прямых линий. Минималистичный подход к традиционному сюжету.',
      image: 'content/wolve.jpg',
      style: 'graphic',
      artist: {
        id: 2,
        name: 'Марина Соколова',
        avatar: 'https://images.pexels.com/photos/1310474/pexels-photo-1310474.jpeg',
        profile: 'artists.html?id=2'
      }
    },
    {
      id: 3,
      title: 'Японский дракон',
      description: 'Традиционный японский дракон в стиле ирэдзуми. Работа выполнена с соблюдением канонов традиционной японской татуировки.',
      image: 'content/drakon.jpg',
      style: 'traditional',
      artist: {
        id: 3,
        name: 'Илья Громов',
        avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg',
        profile: 'artists.html?id=3'
      }
    },
    {
      id: 4,
      title: 'Кровавый лист',
      description: 'Реалистичный портрет, отличающийся высокой детализацией и плавными переходами. Работа выполнена с использованием разных оттенков серого и черного.',
      image: 'content/blodyleaves.jpg',
      style: 'realism',
      artist: {
        id: 4,
        name: 'Алексей Морозов',
        avatar: 'content/alex.jpg',
        profile: 'artists.html?id=1'
      }
    },
    {
      id: 5,
      title: 'Неотрадиционная роза',
      description: 'Яркая роза в неотрадиционном стиле. Сочетание насыщенных цветов и четких контуров создает современный взгляд на классический мотив.',
      image: 'content/roza.jpg',
      style: 'neotraditional',
      artist: {
        id: 1,
        name: 'Алексей Морозов',
        avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
        profile: 'artists.html?id=1'
      }
    },
    {
      id: 6,
      title: 'Орнаментальный рукав',
      description: 'Сложный геометрический орнамент, покрывающий всю руку. Татуировка выполнена в технике блэкворк с использованием различных узоров и текстур.',
      image: 'content/rukav.jpg',
      style: 'blackwork',
      artist: {
        id: 2,
        name: 'Марина Соколова',
        avatar: 'https://images.pexels.com/photos/1310474/pexels-photo-1310474.jpeg',
        profile: 'artists.html?id=2'
      }
    },
    {
      id: 7,
      title: 'Олень с ветвями вместо рогов',
      description: 'Необычная композиция, сочетающая элементы пейзажа и абстракции. Работа отражает внутренний мир клиента через символические образы.',
      image: 'content/deer.jpg',
      style: 'graphic',
      artist: {
        id: 3,
        name: 'Илья Громов',
        avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg',
        profile: 'artists.html?id=3'
      }
    },
    {
      id: 8,
      title: 'Огненный Феникс',
      description: 'Классическая татуировка в стиле олд скул. Работа ассоциируется с "перерождением" подобно Фентезийной птице.',
      image: 'content/fenix.jpg',
      style: 'traditional',
      artist: {
        id: 4,
        name: 'Илья Громов',
        avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
        profile: 'artists.html?id=3'
      }
    },
    {
      id: 9,
      title: 'Портрет питомца',
      description: 'Реалистичный портрет любимого домашнего животного. Тонкая проработка деталей, текстуры шерсти и выразительного взгляда.',
      image: 'content/buddy.jpg',
      style: 'realism',
      artist: {
        id: 1,
        name: 'Алексей Морозов',
        avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
        profile: 'artists.html?id=1'
      }
    },
    {
      id: 10,
      title: 'Цветущая сакура',
      description: 'Тонкие лепестки, плавно переходящие в тень от ветра.',
      image: 'content/sakura.jpg',
      style: 'neotraditional',
      artist: {
        id: 2,
        name: 'Марина Соколова',
        avatar: 'https://images.pexels.com/photos/1310474/pexels-photo-1310474.jpeg',
        profile: 'artists.html?id=2'
      }
    },
    {
      id: 11,
      title: 'Колесо Фортуны',
      description: 'Крупная детализированная мандала, покрывающая всю спину. Симметричные узоры образуют гармоничную композицию.',
      image: 'content/fortuna.jpg',
      style: 'blackwork',
      artist: {
        id: 3,
        name: 'Алексей Морозов',
        avatar: 'content/alex.jpg',
        profile: 'artists.html?id=1'
      }
    },
    {
      id: 12,
      title: 'Акварельные цветы',
      description: 'Нежная композиция из цветов, выполненная в технике имитации акварели. Плавные цветовые переходы и отсутствие чётких контуров создают эффект живописи.',
      image: 'content/akvaflower.jpg',
      style: 'neotraditional',
      artist: {
        id: 4,
        name: 'Марина Соколова',
        avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
        profile: 'artists.html?id=2'
      }
    }
  ];

  // Generate gallery items
  const galleryContainer = document.getElementById('gallery-container');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDescription = document.getElementById('lightbox-description');
  const lightboxArtistAvatar = document.getElementById('lightbox-artist-avatar');
  const lightboxArtistName = document.getElementById('lightbox-artist-name');
  const lightboxArtistLink = document.getElementById('lightbox-artist-link');
  const closeLightbox = document.querySelector('.close-lightbox');

  // Initialize gallery with all items
  function renderGallery(items) {
    galleryContainer.innerHTML = '';

    items.forEach(item => {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';
      galleryItem.setAttribute('data-style', item.style);
      galleryItem.setAttribute('data-id', item.id);
      
      galleryItem.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="gallery-item-overlay">
          <div class="gallery-item-title">${item.title}</div>
          <div class="gallery-item-artist">
            <div class="artist-avatar">
              <img src="${item.artist.avatar}" alt="${item.artist.name}">
            </div>
            <span>${item.artist.name}</span>
          </div>
        </div>
      `;
      
      galleryItem.addEventListener('click', () => {
        openLightbox(item);
      });
      
      galleryContainer.appendChild(galleryItem);
    });
  }

  // Filter gallery items by style
  function filterGallery(style) {
    let filteredItems;
    
    if (style === 'all') {
      filteredItems = galleryItems;
    } else {
      filteredItems = galleryItems.filter(item => item.style === style);
    }
    
    renderGallery(filteredItems);
  }

  // Open lightbox with gallery item details
  function openLightbox(item) {
    lightboxImage.src = item.image;
    lightboxImage.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxDescription.textContent = item.description;
    lightboxArtistAvatar.src = item.artist.avatar;
    lightboxArtistAvatar.alt = item.artist.name;
    lightboxArtistName.textContent = item.artist.name;
    lightboxArtistLink.href = item.artist.profile;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close lightbox
  function closeLightboxHandler() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Add event listeners
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      filterGallery(button.getAttribute('data-filter'));
    });
  });

  closeLightbox.addEventListener('click', closeLightboxHandler);
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightboxHandler();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightboxHandler();
    }
  });

  // Initialize gallery
  renderGallery(galleryItems);
});