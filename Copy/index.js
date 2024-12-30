document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const navList = document.querySelector('.nav-list');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.getElementsByClassName('close')[0];
    const galleryImages = document.querySelectorAll('.img-item img');

    // Toggle mobile menu
    menuToggle.addEventListener('click', toggleMenu);
    closeMenu.addEventListener('click', toggleMenu);

    function toggleMenu() {
        navList.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        if (navList.classList.contains('active')) {
            closeMenu.style.display = 'block';
        } else {
            closeMenu.style.display = 'none';
        }
    }

    // Handle dropdown menus
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdownMenu = toggle.nextElementSibling;
            
            // Close all other open dropdowns
            dropdownToggles.forEach(otherToggle => {
                if (otherToggle !== toggle) {
                    otherToggle.nextElementSibling.classList.remove('active');
                    otherToggle.querySelector('i').style.transform = 'rotate(0)';
                }
            });

            // Toggle the clicked dropdown
            dropdownMenu.classList.toggle('active');
            toggle.querySelector('i').style.transform = dropdownMenu.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item')) {
            dropdownToggles.forEach(toggle => {
                toggle.nextElementSibling.classList.remove('active');
                toggle.querySelector('i').style.transform = 'rotate(0)';
            });
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-item a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });

    // Image modal functionality
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            modal.style.display = 'flex';
            modalImg.src = img.src;
        });
    });

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Lazy load images
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, observerOptions);

    galleryImages.forEach(img => {
        observer.observe(img);
    });

    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.backgroundColor = '#fff';
            navbar.style.boxShadow = 'none';
        }
    });
});

