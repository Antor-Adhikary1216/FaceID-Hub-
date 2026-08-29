/**
 * FaceProfile - Main Application JavaScript
 * Handles common interactions and utilities
 */

// ============================================
// Utility Functions
// ============================================

/**
 * Debounce function to limit how often a function is called
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit how often a function is called
 */
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ============================================
// Toast Notifications
// ============================================

const Toast = {
  container: null,

  init() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    this.container.setAttribute('role', 'alert');
    this.container.setAttribute('aria-live', 'polite');
    document.body.appendChild(this.container);
  },

  show(options = {}) {
    const {
      type = 'info',
      title = '',
      message = '',
      duration = 5000
    } = options;

    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        ${this.getIcon(type)}
      </div>
      <div class="toast-content">
        ${title ? `<p class="toast-title">${title}</p>` : ''}
        ${message ? `<p class="toast-message">${message}</p>` : ''}
      </div>
      <button class="toast-close" aria-label="Close notification">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.remove(toast));

    this.container.appendChild(toast);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => this.remove(toast), duration);
    }

    return toast;
  },

  remove(toast) {
    if (toast && toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }
  },

  getIcon(type) {
    const icons = {
      success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>`,
      error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>`,
      warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>`,
      info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>`
    };
    return icons[type] || icons.info;
  },

  success(title, message) {
    return this.show({ type: 'success', title, message });
  },

  error(title, message) {
    return this.show({ type: 'error', title, message });
  },

  warning(title, message) {
    return this.show({ type: 'warning', title, message });
  },

  info(title, message) {
    return this.show({ type: 'info', title, message });
  }
};

// ============================================
// Modal Functions
// ============================================

const Modal = {
  show(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Focus trap
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length) {
        focusableElements[0].focus();
      }
    }
  },

  hide(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  hideAll() {
    document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
};

// Close modals on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    Modal.hideAll();
  }
});

// ============================================
// Form Validation
// ============================================

const FormValidator = {
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  validatePassword(password) {
    return password.length >= 8;
  },

  validateRequired(value) {
    return value.trim().length > 0;
  },

  showError(input, message) {
    const group = input.closest('.input-group');
    if (group) {
      group.classList.add('input-error');
      
      let errorEl = group.querySelector('.input-error-message');
      if (!errorEl) {
        errorEl = document.createElement('p');
        errorEl.className = 'input-error-message';
        group.appendChild(errorEl);
      }
      errorEl.textContent = message;
    }
  },

  clearError(input) {
    const group = input.closest('.input-group');
    if (group) {
      group.classList.remove('input-error');
      const errorEl = group.querySelector('.input-error-message');
      if (errorEl) {
        errorEl.remove();
      }
    }
  }
};

// ============================================
// File Upload Handler
// ============================================

const FileUploader = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],

  validate(file) {
    if (!this.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Unsupported format',
        message: 'Please upload a JPG, PNG, or WEBP image.'
      };
    }

    if (file.size > this.maxSize) {
      return {
        valid: false,
        error: 'File too large',
        message: 'The image must be under 10MB. Please choose a smaller file.'
      };
    }

    return { valid: true };
  },

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};

// ============================================
// Local Storage Helper
// ============================================

const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage:', e);
    }
  }
};

// ============================================
// Accessibility Helpers
// ============================================

const A11y = {
  announce(message, priority = 'polite') {
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    
    setTimeout(() => announcer.remove(), 1000);
  },

  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  }
};

// ============================================
// Theme Management
// ============================================

const Theme = {
  init() {
    const savedTheme = Storage.get('theme', 'light');
    this.set(savedTheme);
  },

  set(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Storage.set('theme', theme);
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    this.set(current === 'light' ? 'dark' : 'light');
  }
};

// ============================================
// Initialize App
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  Theme.init();

  // Add smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Add hover effects for cards
  document.querySelectorAll('.card, .profile-card, .result-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  console.log('FaceProfile app initialized');
});

// Export for use in other scripts
window.FaceProfile = {
  Toast,
  Modal,
  FormValidator,
  FileUploader,
  Storage,
  A11y,
  Theme,
  debounce,
  throttle
};
