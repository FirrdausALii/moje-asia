// Hero uses Bootstrap 5 carousel (#heroCarousel) for slides, touch, keyboard, and autopause on hover.

// Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Add scroll-triggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll('.feature-item, .values-list li, .product-main').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// Add parallax effect to floating elements
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.floating-card');
  
  parallaxElements.forEach((element, index) => {
    const speed = 0.5 + (index * 0.1);
    const yPos = -(scrolled * speed);
    element.style.transform = `translateY(${yPos}px)`;
  });
});

// Add hover effects for interactive elements
document.addEventListener('DOMContentLoaded', () => {
  // Add ripple effect to buttons
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
  .btn-primary, .btn-outline {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style); 

// Contact Form Functionality
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Add floating label functionality
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', handleInputFocus);
      input.addEventListener('blur', handleInputBlur);
      input.addEventListener('input', handleInputChange);
    });
    
    // Budget slider functionality
    const budgetSlider = document.getElementById('budget');
    if (budgetSlider) {
      budgetSlider.addEventListener('input', updateBudgetLabel);
      updateBudgetLabel({ target: budgetSlider });
    }
  }
});

function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('.contact-submit-btn') || form.querySelector('button[type="submit"]');
  if (!submitBtn) return;

  const formData = new FormData(form);
  const btnText = submitBtn.querySelector('.btn-text');
  const btnIcon = submitBtn.querySelector('.btn-icon');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  if (btnText) btnText.classList.add('d-none');
  if (btnIcon) btnIcon.classList.add('d-none');
  if (btnLoading) btnLoading.classList.remove('d-none');

  setTimeout(() => {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    if (btnText) btnText.classList.remove('d-none');
    if (btnIcon) btnIcon.classList.remove('d-none');
    if (btnLoading) btnLoading.classList.add('d-none');

    form.classList.add('d-none');
    const success = document.getElementById('formSuccess');
    if (success) success.classList.remove('d-none');

    console.log('Form submitted:', Object.fromEntries(formData));
  }, 2000);
}

function handleInputFocus(e) {
  const wrapper = e.target.closest('.input-wrapper, .select-wrapper, .textarea-wrapper');
  if (wrapper) {
    wrapper.classList.add('focused');
  }
}

function handleInputBlur(e) {
  const wrapper = e.target.closest('.input-wrapper, .select-wrapper, .textarea-wrapper');
  if (wrapper) {
    wrapper.classList.remove('focused');
  }
}

function handleInputChange(e) {
  const input = e.target;
  const wrapper = input.closest('.input-wrapper, .select-wrapper, .textarea-wrapper');
  
  if (input.value.trim() !== '') {
    wrapper.classList.add('has-value');
  } else {
    wrapper.classList.remove('has-value');
  }
}

function updateBudgetLabel(e) {
  const input = e.target;
  const value = input.value;
  const labels = ['RM1K – RM5K', 'RM5K – RM10K', 'RM10K – RM25K', 'RM25K – RM50K', 'RM50K+'];
  const label = labels[parseInt(value, 10)] || labels[2];
  const display = document.getElementById('budgetDisplay');
  if (display) display.textContent = label;
  input.setAttribute('aria-valuetext', label);
}

function resetForm() {
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (!form) return;

  form.reset();
  form.classList.remove('d-none');
  if (formSuccess) formSuccess.classList.add('d-none');

  const budgetSlider = document.getElementById('budget');
  if (budgetSlider) updateBudgetLabel({ target: budgetSlider });
}

// Add smooth scrolling for contact link
document.querySelectorAll('a[href="#contact"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Bootstrap navbar auto-close on mobile
document.addEventListener('DOMContentLoaded', function() {
  const navbarCollapse = document.querySelector('.navbar-collapse');
  if (!navbarCollapse) return;

  function hideNavbarIfMobile() {
    if (window.matchMedia('(max-width: 991.98px)').matches && navbarCollapse.classList.contains('show')) {
      bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
    }
  }

  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', hideNavbarIfMobile);
  });
}); 