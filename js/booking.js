import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', function() {
  // Calendar functionality
  const calendarDays = document.getElementById('calendar-days');
  const currentMonthYear = document.getElementById('current-month-year');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const timeSlots = document.getElementById('time-slots');
  const slotsContainer = timeSlots.querySelector('.slots-container');
  const selectDateMessage = timeSlots.querySelector('.select-date-message');
  const continueBtn = document.getElementById('continue-to-step-2');

  // Booking steps
  const bookingStep1 = document.getElementById('booking-step-1');
  const bookingStep2 = document.getElementById('booking-step-2');
  const bookingStep3 = document.getElementById('booking-step-3');
  const backToStep1Btn = document.getElementById('back-to-step-1');
  const contactForm = document.getElementById('contact-form');

  // Contact method radios
  const contactMethodRadios = document.querySelectorAll('input[name="contact-method"]');
  const telegramField = document.getElementById('telegram-field');
  const vkField = document.getElementById('vk-field');

  // Artists select
  const artistSelect = document.getElementById('artist');

  // Current date
  let currentDate = new Date();
  let selectedDate = null;
  let selectedTimeSlot = null;

  // Month names in Russian
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  // Calendar generation
  function generateCalendar(year, month) {
    calendarDays.innerHTML = '';
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const today = new Date();
    
    currentMonthYear.textContent = `${monthNames[month]} ${year}`;
    
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyDay = document.createElement('div');
      calendarDays.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement('div');
      dayCell.textContent = day;
      
      const cellDate = new Date(year, month, day);
      
      // Disable past dates
      if (cellDate < today.setHours(0, 0, 0, 0)) {
        dayCell.classList.add('inactive');
      } else {
        // Check if this is today
        if (cellDate.toDateString() === new Date().toDateString()) {
          dayCell.classList.add('today');
        }
        
        // Check if this date is selected
        if (selectedDate && day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
          dayCell.classList.add('selected');
        }
        
        dayCell.addEventListener('click', () => {
          const previouslySelected = document.querySelector('.days div.selected');
          if (previouslySelected) {
            previouslySelected.classList.remove('selected');
          }
          
          dayCell.classList.add('selected');
          selectedDate = new Date(year, month, day);
          generateTimeSlots(selectedDate);
        });
      }
      
      calendarDays.appendChild(dayCell);
    }
  }

  async function getBookedSlots(date) {
    try {
      const dateString = date.toISOString().split('T')[0];
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('booking_date', dateString)
        .neq('status', 'cancelled');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      return bookings ? bookings.map(booking => booking.booking_time) : [];
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      return [];
    }
  }

  async function generateTimeSlots(date) {
    selectDateMessage.style.display = 'none';
    slotsContainer.style.display = 'grid';
    slotsContainer.innerHTML = '<p>Загрузка доступного времени...</p>';
    
    const startHour = 10;
    const endHour = 21;
    
    try {
      // Get booked slots for the selected date
      const bookedSlots = await getBookedSlots(date);
      
      slotsContainer.innerHTML = '';
      
      for (let hour = startHour; hour < endHour; hour++) {
        const timeSlot = document.createElement('div');
        const timeString = `${hour}:00`;
        
        // Check if the slot is booked
        if (bookedSlots.includes(timeString)) {
          timeSlot.className = 'time-slot unavailable';
          timeSlot.title = 'Время занято';
        } else {
          timeSlot.className = 'time-slot';
          timeSlot.addEventListener('click', () => {
            const previouslySelected = document.querySelector('.time-slot.selected');
            if (previouslySelected) {
              previouslySelected.classList.remove('selected');
            }
            
            timeSlot.classList.add('selected');
            selectedTimeSlot = timeString;
            continueBtn.disabled = false;
          });
        }
        
        timeSlot.textContent = timeString;
        slotsContainer.appendChild(timeSlot);
      }
    } catch (error) {
      slotsContainer.innerHTML = '<p class="error">Ошибка загрузки времени. Попробуйте еще раз.</p>';
    }
  }

  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  });

  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  });

  continueBtn.addEventListener('click', () => {
    bookingStep1.classList.remove('active');
    bookingStep2.classList.add('active');
  });

  backToStep1Btn.addEventListener('click', () => {
    bookingStep2.classList.remove('active');
    bookingStep1.classList.add('active');
  });

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Отправка...';
    submitButton.disabled = true;
    
    try {
      const formData = new FormData(contactForm);
      
      // Get contact details based on selected method
      let contactDetails = '';
      const contactMethod = formData.get('contact-method');
      
      if (contactMethod === 'telegram') {
        contactDetails = formData.get('telegram');
      } else if (contactMethod === 'vk') {
        contactDetails = formData.get('vk');
      } else {
        contactDetails = formData.get('phone');
      }
      
      const bookingData = {
        client_name: formData.get('name'),
        phone: formData.get('phone'),
        contact_method: contactMethod,
        contact_details: contactDetails,
        booking_date: selectedDate.toISOString().split('T')[0],
        booking_time: selectedTimeSlot,
        description: formData.get('description'),
        artist_id: formData.get('artist') || null,
        status: 'pending'
      };
      
      // Check if the slot is still available
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .eq('booking_date', bookingData.booking_date)
        .eq('booking_time', bookingData.booking_time)
        .neq('status', 'cancelled');

      if (checkError) {
        console.error('Check error:', checkError);
        throw checkError;
      }

      if (existingBookings && existingBookings.length > 0) {
        alert('Извините, это время уже занято. Пожалуйста, выберите другое время.');
        bookingStep2.classList.remove('active');
        bookingStep1.classList.add('active');
        generateTimeSlots(selectedDate);
        return;
      }

      // Create the booking
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      // Show success message
      document.getElementById('confirmation-date').textContent = selectedDate.toLocaleDateString('ru-RU');
      document.getElementById('confirmation-time').textContent = selectedTimeSlot;
      document.getElementById('confirmation-name').textContent = bookingData.client_name;
      
      bookingStep2.classList.remove('active');
      bookingStep3.classList.add('active');
      
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Произошла ошибка при создании записи. Пожалуйста, попробуйте снова или свяжитесь с нами по телефону.');
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });

  // Contact method change handlers
  contactMethodRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const method = radio.value;
      
      // Hide all additional fields first
      telegramField.style.display = 'none';
      vkField.style.display = 'none';
      
      // Reset required attributes
      document.getElementById('telegram').required = false;
      document.getElementById('vk').required = false;
      
      // Show relevant field and set required
      if (method === 'telegram') {
        telegramField.style.display = 'block';
        document.getElementById('telegram').required = true;
      } else if (method === 'vk') {
        vkField.style.display = 'block';
        document.getElementById('vk').required = true;
      }
    });
  });

  // Phone number formatting
  const phoneInput = document.getElementById('phone');
  phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Remove leading 7 or 8 if present
    if (value.startsWith('7') || value.startsWith('8')) {
      value = value.substring(1);
    }
    
    // Format the number
    if (value.length > 0) {
      let formattedValue = '+7';
      if (value.length > 0) {
        formattedValue += ' (' + value.substring(0, 3);
      }
      if (value.length >= 4) {
        formattedValue += ') ' + value.substring(3, 6);
      }
      if (value.length >= 7) {
        formattedValue += '-' + value.substring(6, 8);
      }
      if (value.length >= 9) {
        formattedValue += '-' + value.substring(8, 10);
      }
      
      e.target.value = formattedValue;
    }
  });

  // Load artists from Supabase
  async function loadArtists() {
    try {
      const { data: artists, error } = await supabase
        .from('artists')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error loading artists:', error);
        throw error;
      }

      const artistSelect = document.getElementById('artist');
      artistSelect.innerHTML = '<option value="">Без предпочтений</option>';
      
      if (artists && artists.length > 0) {
        artists.forEach(artist => {
          const option = document.createElement('option');
          option.value = artist.id;
          option.textContent = artist.name;
          artistSelect.appendChild(option);
        });
      }
    } catch (error) {
      console.error('Error loading artists:', error);
      // Keep the default option if loading fails
    }
  }

  // Initialize the booking system
  function init() {
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    loadArtists();
  }

  // Start the application
  init();
});