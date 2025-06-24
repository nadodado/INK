document.addEventListener('DOMContentLoaded', function() {
  // Blog posts data
  const blogPostsData = {
    1: {
      title: 'Правильный уход за новой татуировкой',
      excerpt: 'Узнайте, как правильно ухаживать за свежей татуировкой, чтобы сохранить яркость цветов и избежать осложнений.',
      content: `
        <h2>Первые часы после сеанса</h2>
        <p>Сразу после завершения татуировки мастер накладывает защитную пленку или повязку. Не снимайте ее в течение 2-4 часов. Это защитит свежую рану от бактерий и загрязнений.</p>
        
        <h2>Первое мытье</h2>
        <p>Через несколько часов аккуратно снимите защитную пленку и промойте татуировку теплой водой с антибактериальным мылом. Используйте только руки - никаких мочалок или губок!</p>
        
        <h3>Что использовать для ухода:</h3>
        <ul>
          <li>Антибактериальное мыло без отдушек</li>
          <li>Специальный крем для заживления татуировок</li>
          <li>Чистые бумажные полотенца</li>
        </ul>
        
        <h2>Чего избегать</h2>
        <p>В первые 2-3 недели избегайте:</p>
        <ul>
          <li>Прямых солнечных лучей</li>
          <li>Бассейнов и открытых водоемов</li>
          <li>Саун и бань</li>
          <li>Интенсивных физических нагрузок</li>
          <li>Тесной одежды в области татуировки</li>
        </ul>
        
        <p>Помните: правильный уход - залог красивого результата и быстрого заживления!</p>
      `,
      image_url: 'https://images.pexels.com/photos/6864683/pexels-photo-6864683.jpeg',
      category: 'Уход за татуировками',
      read_time: 7,
      created_at: '2025-06-15'
    },
    2: {
      title: 'Тренды татуировки 2025 года',
      excerpt: 'Какие стили татуировок набирают популярность в этом году? Разбираемся в современных трендах.',
      content: `
        <h2>Минимализм продолжает править</h2>
        <p>Тонкие линии, простые формы и лаконичные композиции остаются на пике популярности. Особенно востребованы небольшие символичные татуировки.</p>
        
        <h2>Возвращение цвета</h2>
        <p>После нескольких лет доминирования черно-серых работ, цветные татуировки снова в тренде. Особенно популярны:</p>
        <ul>
          <li>Акварельная техника</li>
          <li>Неоновые оттенки</li>
          <li>Пастельные тона</li>
        </ul>
        
        <h2>Персонализация</h2>
        <p>Клиенты все чаще просят уникальные дизайны, отражающие их личную историю. Мастера работают как художники-иллюстраторы, создавая индивидуальные произведения.</p>
        
        <h2>Технологические мотивы</h2>
        <p>QR-коды, пиксельная графика и киберпанк-эстетика находят отражение в современных татуировках.</p>
      `,
      image_url: 'https://images.pexels.com/photos/7276128/pexels-photo-7276128.jpeg',
      category: 'Стили татуировок',
      read_time: 5,
      created_at: '2025-07-02'
    },
    3: {
      title: 'Что нужно знать перед первой татуировкой',
      excerpt: 'Готовитесь к своей первой татуировке? Рассказываем, к чему нужно быть готовым и как выбрать эскиз.',
      content: `
        <h2>Выбор дизайна</h2>
        <p>Не торопитесь с выбором. Подумайте над дизайном несколько недель или даже месяцев. Татуировка останется с вами на всю жизнь.</p>
        
        <h2>Размер и расположение</h2>
        <p>Для первой татуировки рекомендуется выбрать:</p>
        <ul>
          <li>Небольшой размер</li>
          <li>Место, которое можно скрыть одеждой</li>
          <li>Область с меньшей болевой чувствительностью</li>
        </ul>
        
        <h2>Подготовка к сеансу</h2>
        <h3>За день до сеанса:</h3>
        <ul>
          <li>Хорошо выспитесь</li>
          <li>Не употребляйте алкоголь</li>
          <li>Увлажните кожу</li>
        </ul>
        
        <h3>В день сеанса:</h3>
        <ul>
          <li>Плотно позавтракайте</li>
          <li>Наденьте удобную одежду</li>
          <li>Возьмите с собой воду и легкий перекус</li>
        </ul>
        
        <h2>Что ожидать</h2>
        <p>Боль - это нормально, но она терпима. Большинство людей описывают ощущения как царапание или жжение. Первые минуты самые неприятные, затем организм адаптируется.</p>
        
        <p>Доверьтесь своему мастеру и наслаждайтесь процессом создания вашего первого произведения искусства на коже!</p>
      `,
      image_url: 'https://images.pexels.com/photos/4125596/pexels-photo-4125596.jpeg',
      category: 'Советы и рекомендации',
      read_time: 8,
      created_at: '2025-07-20'
    }
  };

  // Check if we're on a single post page
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  
  if (postId && blogPostsData[postId]) {
    // Load single post
    const post = blogPostsData[postId];
    document.title = `${post.title} - INK Studio`;
    renderSinglePost(post);
  }

  // Add click handlers to blog cards for navigation
  const blogCards = document.querySelectorAll('.blog-card');
  blogCards.forEach(card => {
    const readMoreLink = card.querySelector('.read-more');
    if (readMoreLink) {
      readMoreLink.addEventListener('click', function(e) {
        e.preventDefault();
        const postId = card.getAttribute('data-id');
        if (blogPostsData[postId]) {
          window.location.href = `blog-post.html?id=${postId}`;
        }
      });
    }
  });
});

function renderSinglePost(post) {
  const postContainer = document.querySelector('.post-content');
  if (!postContainer) return;
  
  postContainer.innerHTML = `
    <div class="post-header">
      <div class="post-image">
        <img src="${post.image_url}" alt="${post.title}">
      </div>
      <h1>${post.title}</h1>
      <div class="post-meta">
        <span class="post-date">${new Date(post.created_at).toLocaleDateString('ru-RU')}</span>
        <span class="post-category">${post.category}</span>
        <span class="post-read-time">${post.read_time} мин чтения</span>
      </div>
    </div>
    <div class="post-body">
      ${post.content}
    </div>
  `;
}