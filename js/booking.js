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

  // Calendar state
  let currentDate = new Date();
  let selectedDate = null;
  let selectedTimeSlot = null;

  // Month names in Russian
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  // Calendar class for better organization
  class Calendar {
    constructor(container, monthYearDisplay) {
      this.container = container;
      this.monthYearDisplay = monthYearDisplay;
      this.currentDate = new Date();
      this.selectedDate = null;
      this.onDateSelect = null;
    }

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    getFirstDayOfMonth(year, month) {
      const firstDay = new Date(year, month, 1).getDay();
      // Convert Sunday (0) to be last day (6), Monday (1) to be first (0)
      return firstDay === 0 ? 6 : firstDay - 1;
    }

    // Get number of days in month
    getDaysInMonth(year, month) {
      return new Date(year, month + 1, 0).getDate();
    }

    // Check if date is today
    isToday(year, month, day) {
      const today = new Date();
      return year === today.getFullYear() && 
             month === today.getMonth() && 
             day === today.getDate();
    }

    // Check if date is in the past
    isPastDate(year, month, day) {
      const date = new Date(year, month, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    }

    // Check if date is selected
    isSelected(year, month, day) {
      if (!this.selectedDate) return false;
      return year === this.selectedDate.getFullYear() && 
             month === this.selectedDate.getMonth() && 
             day === this.selectedDate.getDate();
    }

    // Generate calendar for given month/year
    generate(year, month) {
      // Clear previous calendar
      this.container.innerHTML = '';
      
      // Update month/year display
      this.monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
      
      const firstDay = this.getFirstDayOfMonth(year, month);
      const daysInMonth = this.getDaysInMonth(year, month);
      
      // Add empty cells for days before first day of month
      for (let i = 0; i < firstDay; i++) {
        const emptyCell = this.createEmptyCell();
        this.container.appendChild(emptyCell);
      }
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = this.createDayCell(year, month, day);
        this.container.appendChild(dayCell);
      }
    }

    // Create empty cell for padding
    createEmptyCell() {
      const cell = document.createElement('div');
      cell.className = 'calendar-empty';
      return cell;
    }

    // Create day cell
    createDayCell(year, month, day) {
      const cell = document.createElement('div');
      cell.textContent = day;
      cell.className = 'calendar-day';
      
      // Add appropriate classes
      if (this.isPastDate(year, month, day)) {
        cell.classList.add('inactive');
        cell.title = 'Дата недоступна';
      } else {
        if (this.isToday(year, month, day)) {
          cell.classList.add('today');
        }
        
        if (this.isSelected(year, month, day)) {
          cell.classList.add('selected');
        }
        
        // Add click handler for active dates
        cell.addEventListener('click', () => {
          this.selectDate(year, month, day);
        });
        
        cell.style.cursor = 'pointer';
      }
      
      return cell;
    }

    // Select a date
    selectDate(year, month, day) {
      // Remove previous selection
      const previousSelected = this.container.querySelector('.selected');
      if (previousSelected) {
        previousSelected.classList.remove('selected');
      }
      
      // Set new selection
      this.selectedDate = new Date(year, month, day);
      
      // Add selected class to clicked cell
      const clickedCell = Array.from(this.container.children).find(cell => {
        return cell.textContent == day && !cell.classList.contains('inactive');
      });
      
      if (clickedCell) {
        clickedCell.classList.add('selected');
      }
      
      // Trigger callback if set
      if (this.onDateSelect) {
        this.onDateSelect(this.selectedDate);
      }
    }

    // Navigate to previous month
    previousMonth() {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.generate(this.currentDate.getFullYear(), this.currentDate.getMonth());
    }

    // Navigate to next month
    nextMonth() {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.generate(this.currentDate.getFullYear(), this.currentDate.getMonth());
    }

    // Get selected date
    getSelectedDate() {
      return this.selectedDate;
    }

    // Set date selection callback
    setOnDateSelect(callback) {
      this.onDateSelect = callback;
    }
  }

  // Time slots class
  class TimeSlots {
    constructor(container, slotsContainer, messageContainer) {
      this.container = container;
      this.slotsContainer = slotsContainer;
      this.messageContainer = messageContainer;
      this.selectedSlot = null;
      this.onSlotSelect = null;
      this.bookedSlots = [];
    }

    // Show loading state
    showLoading() {
      this.messageContainer.style.display = 'none';
      this.slotsContainer.style.display = 'block';
      this.slotsContainer.innerHTML = '<p>Загрузка доступного времени...</p>';
    }

    // Show error state
    showError(message = 'Ошибка загрузки времени. Попробуйте еще раз.') {
      this.messageContainer.style.display = 'none';
      this.slotsContainer.style.display = 'block';
      this.slotsContainer.innerHTML = `<p class="error">${message}</p>`;
    }

    // Generate time slots for a date
    async generate(date) {
      this.showLoading();
      
      try {
        // Get booked slots for the date
        this.bookedSlots = await this.getBookedSlots(date);
        
        // Clear container
        this.slotsContainer.innerHTML = '';
        this.slotsContainer.style.display = 'grid';
        
        // Generate slots from 10:00 to 21:00
        const startHour = 10;
        const endHour = 21;
        
        for (let hour = startHour; hour < endHour; hour++) {
          const timeString = `${hour}:00`;
          const slot = this.createTimeSlot(timeString);
          this.slotsContainer.appendChild(slot);
        }
        
      } catch (error) {
        console.error('Error generating time slots:', error);
        this.showError();
      }
    }

    // Create time slot element
    createTimeSlot(timeString) {
      const slot = document.createElement('div');
      slot.className = 'time-slot';
      slot.textContent = timeString;
      
      // Check if slot is booked
      if (this.bookedSlots.includes(timeString)) {
        slot.classList.add('unavailable');
        slot.title = 'Время занято';
      } else {
        // Add click handler for available slots
        slot.addEventListener('click', () => {
          this.selectSlot(timeString, slot);
        });
        
        slot.style.cursor = 'pointer';
      }
      
      return slot;
    }

    // Select a time slot
    selectSlot(timeString, slotElement) {
      // Remove previous selection
      const previousSelected = this.slotsContainer.querySelector('.selected');
      if (previousSelected) {
        previousSelected.classList.remove('selected');
      }
      
      // Set new selection
      slotElement.classList.add('selected');
      this.selectedSlot = timeString;
      
      // Trigger callback if set
      if (this.onSlotSelect) {
        this.onSlotSelect(timeString);
      }
    }

    // Get booked slots for a date
    async getBookedSlots(date) {
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

    // Get selected slot
    getSelectedSlot() {
      return this.selectedSlot;
    }

    // Set slot selection callback
    setOnSlotSelect(callback) {
      this.onSlotSelect = callback;
    }

    // Hide time slots
    hide() {
      this.messageContainer.style.display = 'block';
      this.slotsContainer.style.display = 'none';
      this.selectedSlot = null;
    }
  }

  // Form validation class
  class FormValidator {
    constructor(form) {
      this.form = form;
      this.errors = {};
    }

    // Validate required fields
    validateRequired(fieldName, value, message) {
      if (!value || value.trim() === '') {
        this.errors[fieldName] = message;
        return false;
      }
      delete this.errors[fieldName];
      return true;
    }

    // Validate phone number
    validatePhone(phone) {
      const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
      if (!phoneRegex.test(phone)) {
        this.errors.phone = 'Неверный формат телефона';
        return false;
      }
      delete this.errors.phone;
      return true;
    }

    // Validate form
    validate(formData) {
      this.errors = {};
      
      // Validate required fields
      this.validateRequired('name', formData.get('name'), 'Введите ваше имя');
      this.validateRequired('phone', formData.get('phone'), 'Введите номер телефона');
      this.validateRequired('description', formData.get('description'), 'Опишите желаемую татуировку');
      
      // Validate phone format
      if (formData.get('phone')) {
        this.validatePhone(formData.get('phone'));
      }
      
      // Validate contact method specific fields
      const contactMethod = formData.get('contact-method');
      if (contactMethod === 'telegram') {
        this.validateRequired('telegram', formData.get('telegram'), 'Введите ваш Телеграм');
      } else if (contactMethod === 'vk') {
        this.validateRequired('vk', formData.get('vk'), 'Введите ваш ВКонтакте');
      }
      
      // Check agreement
      if (!formData.get('agree')) {
        this.errors.agree = 'Необходимо согласие на обработку данных';
      }
      
      return Object.keys(this.errors).length === 0;
    }

    // Show errors
    showErrors() {
      // Remove previous error messages
      this.form.querySelectorAll('.error-message').forEach(el => el.remove());
      
      // Add new error messages
      Object.keys(this.errors).forEach(fieldName => {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (field) {
          const errorDiv = document.createElement('div');
          errorDiv.className = 'error-message';
          errorDiv.style.color = '#f44336';
          errorDiv.style.fontSize = '0.875rem';
          errorDiv.style.marginTop = '0.25rem';
          errorDiv.textContent = this.errors[fieldName];
          
          field.parentNode.appendChild(errorDiv);
        }
      });
    }
  }

  // Phone formatter utility
  class PhoneFormatter {
    static format(input) {
      let value = input.value.replace(/\D/g, '');
      
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
        
        input.value = formattedValue;
      }
    }
  }

  // Initialize calendar
  const calendar = new Calendar(calendarDays, currentMonthYear);
  const timeSlotManager = new TimeSlots(timeSlots, slotsContainer, selectDateMessage);
  const formValidator = new FormValidator(contactForm);

  // Set up calendar callbacks
  calendar.setOnDateSelect((date) => {
    selectedDate = date;
    timeSlotManager.generate(date);
  });

  // Set up time slots callbacks
  timeSlotManager.setOnSlotSelect((timeString) => {
    selectedTimeSlot = timeString;
    continueBtn.disabled = false;
  });

  // Calendar navigation
  prevMonthBtn.addEventListener('click', () => {
    calendar.previousMonth();
  });

  nextMonthBtn.addEventListener('click', () => {
    calendar.nextMonth();
  });

  // Step navigation
  continueBtn.addEventListener('click', () => {
    bookingStep1.classList.remove('active');
    bookingStep2.classList.add('active');
  });

  backToStep1Btn.addEventListener('click', () => {
    bookingStep2.classList.remove('active');
    bookingStep1.classList.add('active');
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
    PhoneFormatter.format(e.target);
  });

  // Form submission
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Отправка...';
    submitButton.disabled = true;
    
    try {
      const formData = new FormData(contactForm);
      
      // Validate form
      if (!formValidator.validate(formData)) {
        formValidator.showErrors();
        return;
      }
      
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
        timeSlotManager.generate(selectedDate);
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
    calendar.generate(calendar.currentDate.getFullYear(), calendar.currentDate.getMonth());
    loadArtists();
  }

  // Start the application
  init();
});