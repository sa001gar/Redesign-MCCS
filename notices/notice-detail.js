document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters (for dynamic content loading)
    const urlParams = new URLSearchParams(window.location.search);
    const noticeId = urlParams.get('id');
    
    // If we have a notice ID, we can use it to fetch the specific notice data
    if (noticeId) {
        loadNoticeData(noticeId);
    }
    
    // For demo purposes, we'll use placeholder data
    // In a real implementation, this would be replaced with actual data from backend
    const pdfPath = '/pdfs/notices/' + (noticeId || 'sample') + '.pdf';
    
    // Set PDF links
    const downloadBtn = document.getElementById('pdf-download');
    const viewBtn = document.getElementById('pdf-view');
    const pdfIframe = document.getElementById('pdf-iframe');
    
    if (downloadBtn) {
        downloadBtn.setAttribute('href', pdfPath);
        downloadBtn.setAttribute('download', 'notice.pdf');
    }
    
    if (viewBtn) {
        viewBtn.setAttribute('href', pdfPath);
    }
    
    // Load PDF in iframe after a slight delay to show loading animation
    setTimeout(() => {
        if (pdfIframe) {
            pdfIframe.setAttribute('src', pdfPath);
            
            // Hide loading screen when PDF is loaded
            pdfIframe.onload = function() {
                document.querySelector('.pdf-loading').style.display = 'none';
            };
        }
    }, 1000);
    
    // Handle mobile PDF viewing
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // On mobile, it might be better to open PDFs in a new tab rather than in an iframe
        const pdfViewer = document.getElementById('pdf-viewer');
        
        if (pdfViewer) {
            pdfViewer.addEventListener('click', function() {
                window.open(pdfPath, '_blank');
            });
            
            // Add a hint for mobile users
            const mobileHint = document.createElement('div');
            mobileHint.className = 'mobile-hint';
            mobileHint.innerHTML = '<p>Tap on the viewer to open PDF in full screen</p>';
            pdfViewer.appendChild(mobileHint);
            
            // Add CSS for the hint
            const style = document.createElement('style');
            style.textContent = `
                .mobile-hint {
                    position: absolute;
                    bottom: 10px;
                    left: 0;
                    right: 0;
                    text-align: center;
                    background: rgba(0,0,0,0.7);
                    color: white;
                    padding: 10px;
                    font-size: 14px;
                    z-index: 2;
                }
            `;
            document.head.appendChild(style);
        }
    }
});

// Function to load notice data from server
function loadNoticeData(noticeId) {
    // This is where you would make an API call to your backend
    // For example: fetch('/api/notices/' + noticeId)
    
    // For demo purposes, we'll just simulate loading data
    console.log('Loading notice data for ID:', noticeId);
    
    // In a real implementation, this would use data returned from the server
    // document.getElementById('notice-title').textContent = data.title;
    // document.getElementById('notice-category').textContent = data.category;
    // document.getElementById('notice-date').textContent = data.date;
}