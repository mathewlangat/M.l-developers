// script.js
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll('.card, .section h2');
  animateElements.forEach(el => observer.observe(el));

  // Add animation class styles dynamically
  const style = document.createElement('style');
  style.textContent = `
    .card.animate, .section h2.animate {
      animation: slideIn 0.8s ease-out forwards;
    }
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;
  document.head.appendChild(style);

  // Typing effect for hero text
  const heroText = document.querySelector('.hero-content h1');
  if (heroText) {
    const text = heroText.textContent;
    heroText.textContent = '';
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroText.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };
    typeWriter();
  }

  // Parallax effect for hero background
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });

  // Form submission handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your message! I will get back to you soon.');
      this.reset();
    });
  }

  // M-Pesa Payment Calculator
  const serviceSelect = document.getElementById('service-select');
  const amountInput = document.getElementById('amount-input');
  const conversionResult = document.getElementById('conversion-result');
  const kesAmount = document.getElementById('kes-amount');

  // Exchange rate: 1 USD = 130 KES (approximate)
  const EXCHANGE_RATE = 130;

  function updatePayment(amount) {
    if (amount > 0) {
      const kesEquivalent = Math.round(amount * EXCHANGE_RATE);
      kesAmount.textContent = kesEquivalent.toLocaleString() + ' KES';
      conversionResult.style.display = 'block';
    } else {
      conversionResult.style.display = 'none';
    }
  }

  if (serviceSelect) {
    serviceSelect.addEventListener('change', function() {
      const selectedAmount = parseFloat(this.value);
      amountInput.value = selectedAmount;
      updatePayment(selectedAmount);
    });
  }

  if (amountInput) {
    amountInput.addEventListener('input', function() {
      const customAmount = parseFloat(this.value) || 0;
      updatePayment(customAmount);
    });
  }

  // Initialize with first service selected
  if (serviceSelect && serviceSelect.options.length > 0) {
    const initialAmount = parseFloat(serviceSelect.value);
    amountInput.value = initialAmount;
    updatePayment(initialAmount);
  }

  // M-Pesa App Integration
  const mpesaPayBtn = document.getElementById('mpesa-pay-btn');
  const mpesaStatus = document.getElementById('mpesa-status');

  function openMpesaApp() {
    const amount = parseFloat(amountInput.value) || 0;
    if (amount <= 0) {
      alert('Please select a service or enter an amount first.');
      return;
    }

    // Hide status message initially
    mpesaStatus.style.display = 'none';

    // Try different M-Pesa URL schemes
    const mpesaSchemes = [
      'mpesa://',  // General M-Pesa app opener
      'mpesa://sendmoney',  // Direct to send money (if supported)
      'mpesa://paybill'  // Pay bill option (if supported)
    ];

    let appOpened = false;
    const originalLocation = window.location.href;

    // Try to open M-Pesa app
    for (const scheme of mpesaSchemes) {
      try {
        window.location.href = scheme;
        appOpened = true;
        break;
      } catch (e) {
        console.log('Failed to open with scheme:', scheme);
      }
    }

    // If app opening attempt was made, show status after a delay
    if (appOpened) {
      setTimeout(() => {
        // Check if we're still on the same page (app didn't open)
        if (window.location.href === originalLocation) {
          mpesaStatus.style.display = 'block';
          mpesaStatus.innerHTML = `
            <p style="color: #ff6b6b;">⚠️ M-Pesa app didn't open automatically.</p>
            <p>Please open your M-Pesa app manually and follow these steps:</p>
            <ol style="text-align: left; margin: 0.5rem 0 0 1rem;">
              <li>Select "Send Money"</li>
              <li>Enter phone number: <strong>0742885433</strong></li>
              <li>Enter amount: <strong>${Math.round(amount * EXCHANGE_RATE).toLocaleString()} KES</strong></li>
              <li>Enter your M-Pesa PIN</li>
              <li>Send the payment</li>
            </ol>
          `;
        } else {
          // App opened successfully
          mpesaStatus.style.display = 'block';
          mpesaStatus.innerHTML = `
            <p style="color: #32cd32;">✅ M-Pesa app opened successfully!</p>
            <p>Please select "Send Money" and enter the payment details shown above.</p>
          `;
        }
      }, 2000); // Wait 2 seconds to check if app opened
    } else {
      // No scheme worked, show manual instructions
      mpesaStatus.style.display = 'block';
      mpesaStatus.innerHTML = `
        <p style="color: #ff6b6b;">⚠️ Unable to open M-Pesa app automatically.</p>
        <p>Please open your M-Pesa app manually and follow these steps:</p>
        <ol style="text-align: left; margin: 0.5rem 0 0 1rem;">
          <li>Select "Send Money"</li>
          <li>Enter phone number: <strong>0742885433</strong></li>
          <li>Enter amount: <strong>${Math.round(amount * EXCHANGE_RATE).toLocaleString()} KES</strong></li>
          <li>Enter your M-Pesa PIN</li>
          <li>Send the payment</li>
        </ol>
      `;
    }
  }

  if (mpesaPayBtn) {
    mpesaPayBtn.addEventListener('click', openMpesaApp);
  }
});