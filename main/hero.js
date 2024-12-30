document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.slider-image');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    let currentImageIndex = 0;

    function showImage(index) {
        images.forEach(img => img.classList.remove('active'));
        images[index].classList.add('active');
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        showImage(currentImageIndex);
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        showImage(currentImageIndex);
    }

    leftArrow.addEventListener('click', prevImage);
    rightArrow.addEventListener('click', nextImage);

    // Auto-advance the slider
    setInterval(nextImage, 5000);

    // Scrolling effect for notices
    const noticeContent = document.querySelector('.notice-content');
    const noticeItems = document.querySelectorAll('.notice-item');
    let currentNoticeIndex = 0;

    function scrollNotices() {
        currentNoticeIndex = (currentNoticeIndex + 1) % noticeItems.length;
        noticeItems.forEach((item, index) => {
            item.style.transform = `translateY(${-100 * currentNoticeIndex}%)`;
        });
    }

    setInterval(scrollNotices, 1000);
});