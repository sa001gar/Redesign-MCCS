// Set up PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.0,
    isMobile = window.innerWidth <= 768;

const viewer = document.getElementById('pdf-viewer'),
      pageLeft = document.getElementById('page-left'),
      pageRight = document.getElementById('page-right'),
      prevButton = document.getElementById('prev-page'),
      nextButton = document.getElementById('next-page'),
      pageNumSpan = document.getElementById('page-num'),
      zoomInButton = document.getElementById('zoom-in'),
      zoomOutButton = document.getElementById('zoom-out'),
      zoomLevelSpan = document.getElementById('zoom-level'),
      yearSelect = document.getElementById('year-select'),
      semesterSelect = document.getElementById('semester-select'),
      downloadButton = document.getElementById('download-pdf');

function renderPage(num, container) {
    pageRendering = true;
    pdfDoc.getPage(num).then(function(page) {
        const viewport = page.getViewport({scale: scale});
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        const renderTask = page.render(renderContext);

        renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPages(pageNumPending);
                pageNumPending = null;
            }
        });

        container.innerHTML = '';
        container.appendChild(canvas);
    }).catch(function(error) {
        console.error('Error rendering page:', error);
        container.innerHTML = `<p>Error rendering page: ${error.message}</p>`;
    });
}

function renderPages(num) {
    renderPage(num, pageLeft);
    if (!isMobile && num + 1 <= pdfDoc.numPages) {
        renderPage(num + 1, pageRight);
    } else {
        pageRight.innerHTML = '';
    }
    pageNumSpan.textContent = isMobile 
        ? `Page ${num} of ${pdfDoc.numPages}`
        : `Pages ${num}-${Math.min(num+1, pdfDoc.numPages)} of ${pdfDoc.numPages}`;
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPages(num);
    }
}

function onPrevPage() {
    if (pageNum <= 1) return;
    pageNum -= isMobile ? 1 : 2;
    if (pageNum < 1) pageNum = 1;
    pageLeft.classList.add('page-turn');
    setTimeout(() => {
        queueRenderPage(pageNum);
        pageLeft.classList.remove('page-turn');
    }, 150);
}

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum += isMobile ? 1 : 2;
    if (pageNum > pdfDoc.numPages) pageNum = pdfDoc.numPages;
    if (!isMobile) {
        pageRight.classList.add('page-turn');
    }
    setTimeout(() => {
        queueRenderPage(pageNum);
        if (!isMobile) {
            pageRight.classList.remove('page-turn');
        }
    }, 150);
}

function onZoomIn() {
    if (scale < 3.0) {
        scale += 0.1;
        queueRenderPage(pageNum);
        updateZoomLevel();
    }
}

function onZoomOut() {
    if (scale > 0.5) {
        scale -= 0.1;
        queueRenderPage(pageNum);
        updateZoomLevel();
    }
}

function updateZoomLevel() {
    zoomLevelSpan.textContent = `${Math.round(scale * 100)}%`;
}

function loadPDF(url) {
    pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
        pdfDoc = pdfDoc_;
        pageNum = 1;
        renderPages(pageNum);
        downloadButton.href = url;
        downloadButton.download = url.split('/').pop();
    }).catch(function(error) {
        console.error('Error loading PDF:', error);
        viewer.innerHTML = `<p>Error loading PDF: ${error.message}</p>`;
    });
}

prevButton.addEventListener('click', onPrevPage);
nextButton.addEventListener('click', onNextPage);
zoomInButton.addEventListener('click', onZoomIn);
zoomOutButton.addEventListener('click', onZoomOut);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') onPrevPage();
    if (e.key === 'ArrowRight') onNextPage();
});

// Year and Semester selection
yearSelect.addEventListener('change', updateSyllabus);
semesterSelect.addEventListener('change', updateSyllabus);

function updateSyllabus() {
    const year = yearSelect.value;
    const semester = semesterSelect.value;
    const pdfUrl = `year${year}_semester${semester}.pdf`;
    loadPDF(pdfUrl);
}

// Initial load
updateSyllabus();

// Responsive resizing
function resizeViewer() {
    isMobile = window.innerWidth <= 768;
    const container = viewer.getBoundingClientRect();
    if (isMobile) {
        pageLeft.style.width = `${container.width}px`;
        pageRight.style.display = 'none';
    } else {
        pageLeft.style.width = `${container.width / 2}px`;
        pageRight.style.width = `${container.width / 2}px`;
        pageRight.style.display = 'block';
    }
    if (pdfDoc) {
        queueRenderPage(pageNum);
    }
}

window.addEventListener('resize', resizeViewer);
resizeViewer();

