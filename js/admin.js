import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is authenticated (simple check for demo)
  // In production, you would implement proper authentication
  
  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      
      // Update active tab button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Show corresponding tab content
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `${tabName}-tab`) {
          pane.classList.add('active');
        }
      });
      
      // Load data for the active tab
      if (tabName === 'bookings') {
        loadBookings();
      } else if (tabName === 'gallery') {
        loadGallery();
      } else if (tabName === 'blog') {
        loadBlogPosts();
      }
    });
  });

  // Bookings Management
  const bookingsList = document.querySelector('.bookings-list');
  const dateFilter = document.getElementById('date-filter');
  const statusFilter = document.getElementById('status-filter');
  const applyFiltersBtn = document.getElementById('apply-filters');

  async function loadBookings(date = null, status = null) {
    try {
      bookingsList.innerHTML = '<p>Загрузка бронирований...</p>';
      
      let query = supabase
        .from('bookings')
        .select(`
          *,
          artists (
            name
          )
        `)
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true });

      if (date) {
        query = query.eq('booking_date', date);
      }
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data: bookings, error } = await query;

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      renderBookings(bookings || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      bookingsList.innerHTML = '<p class="error">Ошибка при загрузке бронирований</p>';
    }
  }

  function renderBookings(bookings) {
    bookingsList.innerHTML = '';
    
    if (bookings.length === 0) {
      bookingsList.innerHTML = '<p>Нет бронирований для отображения</p>';
      return;
    }
    
    bookings.forEach(booking => {
      const bookingItem = document.createElement('div');
      bookingItem.className = 'booking-item';
      
      const artistName = booking.artists ? booking.artists.name : 'Не указан';
      const bookingDate = new Date(booking.booking_date).toLocaleDateString('ru-RU');
      
      bookingItem.innerHTML = `
        <div class="booking-info">
          <h3>${booking.client_name}</h3>
          <p><strong>Телефон:</strong> ${booking.phone}</p>
          <p><strong>Связь:</strong> ${booking.contact_method} ${booking.contact_details ? `(${booking.contact_details})` : ''}</p>
          <p><strong>Описание:</strong> ${booking.description}</p>
          <p><strong>Мастер:</strong> ${artistName}</p>
        </div>
        <div class="booking-date">
          <p><strong>${bookingDate}</strong></p>
          <p>${booking.booking_time}</p>
        </div>
        <div class="booking-status">
          <span class="status-badge status-${booking.status}">
            ${getStatusText(booking.status)}
          </span>
        </div>
        <div class="booking-actions">
          ${getActionButtons(booking.id, booking.status)}
        </div>
      `;
      
      bookingsList.appendChild(bookingItem);
    });
    
    // Add event listeners to action buttons
    const actionButtons = bookingsList.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const bookingId = button.getAttribute('data-booking-id');
        const newStatus = button.getAttribute('data-status');
        await updateBookingStatus(bookingId, newStatus);
      });
    });
  }

  function getStatusText(status) {
    const statusTexts = {
      pending: 'Ожидает',
      confirmed: 'Подтверждено',
      completed: 'Завершено',
      cancelled: 'Отменено'
    };
    return statusTexts[status] || status;
  }

  function getActionButtons(bookingId, status) {
    switch (status) {
      case 'pending':
        return `
          <button class="action-btn btn-primary" data-booking-id="${bookingId}" data-status="confirmed">Подтвердить</button>
          <button class="action-btn btn-secondary" data-booking-id="${bookingId}" data-status="cancelled">Отменить</button>
        `;
      case 'confirmed':
        return `
          <button class="action-btn btn-primary" data-booking-id="${bookingId}" data-status="completed">Завершить</button>
          <button class="action-btn btn-secondary" data-booking-id="${bookingId}" data-status="cancelled">Отменить</button>
        `;
      default:
        return '';
    }
  }

  async function updateBookingStatus(bookingId, newStatus) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      // Reload bookings with current filters
      loadBookings(dateFilter.value || null, statusFilter.value || null);
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Ошибка при обновлении статуса');
    }
  }

  // Filter bookings
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      loadBookings(dateFilter.value || null, statusFilter.value || null);
    });
  }

  // Gallery Management
  const addWorkBtn = document.getElementById('add-work-btn');
  const addWorkModal = document.getElementById('add-work-modal');
  const closeModals = document.querySelectorAll('.close-modal');
  const addWorkForm = document.getElementById('add-work-form');
  const cancelAddWork = document.getElementById('cancel-add-work');
  const adminGallery = document.querySelector('.admin-gallery');

  async function loadGallery() {
    try {
      adminGallery.innerHTML = '<p>Загрузка галереи...</p>';
      
      const { data: galleryItems, error } = await supabase
        .from('gallery_items')
        .select(`
          *,
          artists (
            id,
            name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Gallery error:', error);
        throw error;
      }

      renderGallery(galleryItems || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
      adminGallery.innerHTML = '<p class="error">Ошибка при загрузке галереи</p>';
    }
  }

  function renderGallery(galleryItems) {
    adminGallery.innerHTML = '';
    
    if (galleryItems.length === 0) {
      adminGallery.innerHTML = '<p>Нет работ в галерее</p>';
      return;
    }
    
    galleryItems.forEach(item => {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';
      
      const artistName = item.artists ? item.artists.name : 'Неизвестный мастер';
      const artistAvatar = item.artists ? item.artists.avatar_url : '/placeholder-avatar.jpg';
      
      galleryItem.innerHTML = `
        <img src="${item.image_url}" alt="${item.title}" onerror="this.src='/placeholder-image.jpg'">
        <button class="delete-work" data-id="${item.id}">&times;</button>
        <div class="gallery-item-overlay">
          <div class="gallery-item-title">${item.title}</div>
          <div class="gallery-item-artist">
            <div class="artist-avatar">
              <img src="${artistAvatar}" alt="${artistName}" onerror="this.src='/placeholder-avatar.jpg'">
            </div>
            <span>${artistName}</span>
          </div>
        </div>
      `;
      
      // Add delete button event listener
      const deleteBtn = galleryItem.querySelector('.delete-work');
      deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Вы уверены, что хотите удалить эту работу?')) {
          await deleteGalleryItem(item.id);
        }
      });
      
      adminGallery.appendChild(galleryItem);
    });
  }

  async function addGalleryItem(formData) {
    try {
      const newItem = {
        title: formData.get('work-title'),
        description: formData.get('work-description'),
        image_url: formData.get('work-image'),
        style: formData.get('work-style'),
        artist_id: formData.get('work-artist') || null
      };

      const { error } = await supabase
        .from('gallery_items')
        .insert([newItem]);

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      // Reload gallery
      loadGallery();
      alert('Работа успешно добавлена!');
    } catch (error) {
      console.error('Error adding gallery item:', error);
      alert('Ошибка при добавлении работы');
    }
  }

  async function deleteGalleryItem(itemId) {
    try {
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      // Reload gallery
      loadGallery();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Ошибка при удалении работы');
    }
  }

  // Blog Management
  const addPostBtn = document.getElementById('add-post-btn');
  const addPostModal = document.getElementById('add-post-modal');
  const addPostForm = document.getElementById('add-post-form');
  const cancelAddPost = document.getElementById('cancel-add-post');
  const blogPostsList = document.querySelector('.blog-posts-list');

  async function loadBlogPosts() {
    try {
      blogPostsList.innerHTML = '<p>Загрузка постов...</p>';
      
      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Blog posts error:', error);
        throw error;
      }

      renderBlogPosts(posts || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      blogPostsList.innerHTML = '<p class="error">Ошибка при загрузке постов</p>';
    }
  }

  function renderBlogPosts(posts) {
    blogPostsList.innerHTML = '';
    
    if (posts.length === 0) {
      blogPostsList.innerHTML = '<p>Нет опубликованных постов</p>';
      return;
    }
    
    posts.forEach(post => {
      const postItem = document.createElement('div');
      postItem.className = 'blog-post-item';
      
      postItem.innerHTML = `
        <div class="post-info">
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div class="post-meta">
            <span>Категория: ${post.category}</span>
            <span>Время чтения: ${post.read_time} мин</span>
            <span>Дата: ${new Date(post.created_at).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>
        <div class="post-actions">
          <button class="action-btn btn-secondary" onclick="deletePost('${post.id}')">Удалить</button>
        </div>
      `;
      
      blogPostsList.appendChild(postItem);
    });
  }

  // Make deletePost function global for onclick handler
  window.deletePost = async function(postId) {
    if (confirm('Вы уверены, что хотите удалить этот пост?')) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', postId);

        if (error) throw error;
        
        loadBlogPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Ошибка при удалении поста');
      }
    }
  };

  async function addBlogPost(formData) {
    try {
      const newPost = {
        title: formData.get('post-title'),
        excerpt: formData.get('post-excerpt'),
        content: formData.get('post-content'),
        category: formData.get('post-category'),
        image_url: formData.get('post-image'),
        read_time: parseInt(formData.get('post-read-time'))
      };

      const { error } = await supabase
        .from('blog_posts')
        .insert([newPost]);

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      loadBlogPosts();
      alert('Пост успешно добавлен!');
    } catch (error) {
      console.error('Error adding blog post:', error);
      alert('Ошибка при добавлении поста');
    }
  }

  // Modal handling
  if (addWorkBtn) {
    addWorkBtn.addEventListener('click', () => {
      addWorkModal.classList.add('active');
      loadArtistsForForm();
    });
  }

  if (addPostBtn) {
    addPostBtn.addEventListener('click', () => {
      addPostModal.classList.add('active');
    });
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    // Reset forms
    const forms = modal.querySelectorAll('form');
    forms.forEach(form => form.reset());
  }

  closeModals.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const modal = closeBtn.closest('.modal');
      closeModal(modal);
    });
  });

  if (cancelAddWork) {
    cancelAddWork.addEventListener('click', () => {
      closeModal(addWorkModal);
    });
  }

  if (cancelAddPost) {
    cancelAddPost.addEventListener('click', () => {
      closeModal(addPostModal);
    });
  }

  // Close modals when clicking outside
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Form submissions
  if (addWorkForm) {
    addWorkForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await addGalleryItem(new FormData(addWorkForm));
      closeModal(addWorkModal);
    });
  }

  if (addPostForm) {
    addPostForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await addBlogPost(new FormData(addPostForm));
      closeModal(addPostModal);
    });
  }

  // Load artists for the form
  async function loadArtistsForForm() {
    try {
      const { data: artists, error } = await supabase
        .from('artists')
        .select('id, name')
        .order('name');

      if (error) throw error;

      const artistSelect = document.getElementById('work-artist');
      if (artistSelect) {
        artistSelect.innerHTML = '<option value="">Выберите мастера</option>';
        
        if (artists) {
          artists.forEach(artist => {
            const option = document.createElement('option');
            option.value = artist.id;
            option.textContent = artist.name;
            artistSelect.appendChild(option);
          });
        }
      }
    } catch (error) {
      console.error('Error loading artists for form:', error);
    }
  }

  // Logout functionality
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Вы уверены, что хотите выйти?')) {
        // In a real app, you would clear authentication tokens
        window.location.href = 'index.html';
      }
    });
  }

  // Initialize with bookings tab
  loadBookings();
});