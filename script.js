(function () {
    const qs = (sel, ctx = document) => ctx.querySelector(sel);
    const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  
    const header = qs('.site-header');
    if (header) {
      document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
      window.addEventListener('resize', () => {
        document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
      });
    }
  
    // IntersectionObserver for scroll reveals
    const revealEls = qsa('.reveal-on-scroll');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            obs.unobserve(entry.target);
          }
        }
      }, { threshold: 0.15 });
      revealEls.forEach(el => io.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('show'));
    }
  
  // Create subtle hero star particles
  const heroParticles = qs('.hero-particles');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroParticles && !prefersReduced) {
    const createStar = () => {
      const s = document.createElement('span');
      s.className = 'star-dot';
      const size = 6 + Math.random() * 10;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.left = Math.random() * 100 + '%';
      s.style.bottom = '-20px';
      s.style.animationDuration = 8 + Math.random() * 8 + 's';
      s.style.background = Math.random() > 0.5 ? 'var(--yellow)' : 'var(--pink)';
      heroParticles.appendChild(s);
      setTimeout(() => s.remove(), 18000);
    };
    for (let i = 0; i < 16; i++) {
      setTimeout(createStar, i * 300);
    }
    setInterval(createStar, 1200);
  }


  // Hero background animations - falling cameras and random flashes
  const hero = qs('.hero');
  if (hero && !prefersReduced) {
    // Create falling cameras
    const createFallingCamera = () => {
      const camera = document.createElement('div');
      camera.className = 'falling-camera';
      camera.style.left = Math.random() * 100 + '%';
      camera.style.animation = `fallDown ${2 + Math.random() * 3}s linear forwards`;
      
      hero.appendChild(camera);
      
      // Remove after animation
      setTimeout(() => {
        if (camera.parentNode) camera.remove();
      }, 5000);
    };
    
    // Create random flashes in hero area
    const createHeroFlash = () => {
      const flash = document.createElement('div');
      flash.className = 'hero-flash';
      const size = 20 + Math.random() * 40;
      flash.style.width = size + 'px';
      flash.style.height = size + 'px';
      flash.style.left = Math.random() * 100 + '%';
      flash.style.top = Math.random() * 100 + '%';
      
      hero.appendChild(flash);
      
      // Remove after animation
      setTimeout(() => {
        if (flash.parentNode) flash.remove();
      }, 300);
    };
    
    // Start animations
    setInterval(createFallingCamera, 2000 + Math.random() * 3000);
    setInterval(createHeroFlash, 1500 + Math.random() * 2000);
  }
  
    // Smooth scroll with header offset for same-page links
    qsa('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const href = anchor.getAttribute('href');
        const target = href && href.length > 1 ? qs(href) : null;
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight + 10 : 0);
          window.scrollTo({ top, behavior: 'smooth' });
          target.focus({ preventScroll: true });
        }
      });
    });
  
    // Back-to-top visibility
    const backToTop = qs('#backToTop');
    if (backToTop) {
      const toggleBackToTop = () => {
        const show = window.scrollY > 500;
        backToTop.style.opacity = show ? '1' : '0.2';
      };
      toggleBackToTop();
      window.addEventListener('scroll', toggleBackToTop, { passive: true });
    }
  
    // Initialize EmailJS
    emailjs.init('YOUR_PUBLIC_KEY'); // You'll need to replace this with your actual EmailJS public key

    // Contact form handler
    const form = qs('#contact-form');
    const toast = qs('#toast');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = qs('#name', form);
        const email = qs('#email', form);
        const phone = qs('#phone', form);
        const message = qs('#message', form);
  
        let valid = true;
        [name, email, message].forEach(f => {
          if (!f.value.trim()) {
            valid = false;
            f.setAttribute('aria-invalid', 'true');
            f.style.boxShadow = '0 0 0 4px #FF69B4';
          } else {
            f.removeAttribute('aria-invalid');
            f.style.boxShadow = '';
          }
        });
        if (!/^\S+@\S+\.\S+$/.test(email.value)) {
          valid = false;
          email.setAttribute('aria-invalid', 'true');
          email.style.boxShadow = '0 0 0 4px #FF69B4';
        }
  
        if (!valid) return;
  
        // Send email using EmailJS
        const templateParams = {
          from_name: name.value,
          from_email: email.value,
          phone_number: phone.value || 'Not provided',
          message: message.value,
          to_email: 'romantinoproject@gmail.com'
        };

        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
          .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showToast('Thanks! Your message has been sent successfully.');
            form.reset();
          }, function(error) {
            console.log('FAILED...', error);
            showToast('Sorry, there was an error sending your message. Please try again or contact me directly.');
          });
      });
    }
  
    function showToast(text) {
      if (!toast) return;
      toast.textContent = text;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2400);
    }
  

    // Hover pop effect for cards and buttons (enhanced)
    const popTargets = qsa('.comic-card, .btn, .nav-link, .messenger-btn');
    popTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.style.transform += ' translateY(-2px) scale(1.02)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = el.style.transform.replace(' translateY(-2px) scale(1.02)', '');
      });
    });
  })();

  // Booking Modal functionality - runs after DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    const modal = document.querySelector('#booking-modal');
    const bookingName = document.querySelector('#booking-name');
    const bookingForm = document.querySelector('#booking-form');
    const bookBtns = document.querySelectorAll('.book-btn');
    const modalClose = document.querySelector('.modal-close');
    const modalCancel = document.querySelector('.modal-cancel');

    console.log('Modal elements found:', { modal, bookingName, bookingForm, bookBtns: bookBtns.length });

    if (modal && bookBtns.length > 0) {
      // Open modal when book button is clicked
      bookBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          console.log('Book button clicked!');
          e.preventDefault();
          const bookingType = btn.getAttribute('data-booking');
          console.log('Booking type:', bookingType);
          bookingName.textContent = `Booking: ${bookingType}`;
          modal.classList.add('show');
          modal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
      });

      // Close modal functions
      const closeModal = () => {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scrolling
        bookingForm.reset();
      };

      // Close modal events
      if (modalClose) modalClose.addEventListener('click', closeModal);
      if (modalCancel) modalCancel.addEventListener('click', closeModal);
      
      // Close modal when clicking outside
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      // Close modal with Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
          closeModal();
        }
      });

      // Handle form submission
      if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(bookingForm);
          const name = formData.get('name');
          const phone = formData.get('phone');
          const description = formData.get('description');
          const bookingType = bookingName.textContent.replace('Booking: ', '');

          // Create email content
          const subject = `Booking Request: ${bookingType}`;
          const body = `Booking Type: ${bookingType}
Name: ${name}
Phone: ${phone}
Description: ${description}`;

          // Open email client
          const mailtoLink = `mailto:romantinoproject@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          window.location.href = mailtoLink;

          // Close modal
          closeModal();
        });
      }
    }

    const albumConfig = {
      'la-street-vibes': {
        title: 'LA Street Vibes',
        folder: 'albums/la-street-vibes',
        count: 8,
        description: 'Graffiti, rappers, old cars and neon-lit downtown energy.'
      },
      'beach-adventures': {
        title: 'Beach Adventures',
        folder: 'albums/beach-adventures',
        count: 8,
        description: 'Sunset boardwalks, palms, waves and coastal portraits.'
      },
      'hollywood-glam': {
        title: 'Hollywood Glam',
        folder: 'albums/hollywood-glam',
        count: 8,
        description: 'Red carpets, neon signs and classic Hollywood moments.'
      },
      'video-clips': {
        title: 'Video Clips',
        folder: 'albums/video-clips',
        count: 8,
        description: 'Motion shoot stills, set life and cinematic production shots.'
      }
    };

    const albumModal = document.querySelector('#album-modal');
    const albumGallery = document.querySelector('.album-modal-gallery');
    const albumTitle = document.querySelector('#album-modal-title');
    const albumDesc = document.querySelector('.album-modal-description');
    const albumClose = albumModal ? albumModal.querySelector('.modal-close') : null;
    const albumButtons = document.querySelectorAll('.album-open-btn');

    const openAlbumModal = (albumKey) => {
      if (!albumModal || !albumGallery || !albumTitle || !albumDesc) return;
      const album = albumConfig[albumKey];
      if (!album) return;

      albumTitle.textContent = album.title;
      albumDesc.textContent = album.description;
      albumGallery.innerHTML = '';

      const fallback = document.createElement('div');
      fallback.className = 'album-modal-empty';
      fallback.textContent = `Upload images to '${album.folder}' named 1.jpg, 2.jpg, etc. to preview them here.`;
      albumGallery.appendChild(fallback);

      const updateFallback = () => {
        const hasImages = albumGallery.querySelectorAll('img').length > 0;
        fallback.style.display = hasImages ? 'none' : 'block';
      };

      for (let i = 1; i <= album.count; i += 1) {
        const img = document.createElement('img');
        img.src = `${album.folder}/${i}.jpg`;
        img.alt = `${album.title} photo ${i}`;
        img.loading = 'lazy';
        img.addEventListener('load', updateFallback);
        img.addEventListener('error', () => {
          img.remove();
          updateFallback();
        });
        albumGallery.appendChild(img);
      }

      albumModal.classList.add('show');
      albumModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeAlbumModal = () => {
      if (!albumModal) return;
      albumModal.classList.remove('show');
      albumModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (albumGallery) albumGallery.innerHTML = '';
    };

    albumButtons.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        const albumKey = btn.dataset.album;
        openAlbumModal(albumKey);
      });
    });

    if (albumClose) {
      albumClose.addEventListener('click', closeAlbumModal);
    }

    if (albumModal) {
      albumModal.addEventListener('click', (event) => {
        if (event.target === albumModal) closeAlbumModal();
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && albumModal.classList.contains('show')) {
          closeAlbumModal();
        }
      });
    }
  });