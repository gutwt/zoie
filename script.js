// Make revealContent a global function
window.revealContent = function() {
    document.getElementById('overlay').style.display = 'none';
    document.querySelector('.app-container').style.display = 'block';
    playCurrentVideo();
}

const deviceInfo = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    isAndroid: /Android/.test(navigator.userAgent),
    isDesktop: !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
};

function handleTouchStart(event) {
    this.touchStartY = event.touches[0].clientY;
    this.touchStartTime = new Date().getTime();
}

function handleTouchEnd(event) {
    const touchEndY = event.changedTouches[0].clientY;
    const touchEndTime = new Date().getTime();
    
    const yDiff = this.touchStartY - touchEndY;
    const timeDiff = touchEndTime - this.touchStartTime;
    
    if (Math.abs(yDiff) > 50 && timeDiff < 300) {
        if (yDiff > 0) {
            this.nextElementSibling?.scrollIntoView({ behavior: 'smooth' });
        } else {
            this.previousElementSibling?.scrollIntoView({ behavior: 'smooth' });
        }
    } else if (Math.abs(yDiff) < 10 && timeDiff < 300) {
        likeVideo();
    }
}

function playCurrentVideo() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        const rect = video.getBoundingClientRect();
        const visible = (rect.top >= 0 && rect.bottom <= window.innerHeight);
        if (visible) {
            video.play();
        } else {
            video.pause();
        }
    });
}

function likeVideo() {
    const likeBtn = document.querySelector('.like-btn');
    const likeCount = document.querySelector('.like-count');
    let likes = parseInt(likeCount.textContent) || 0;
    likes++;
    likeCount.textContent = likes;
    likeBtn.classList.add('active');
    likeBtn.style.color = '#ff4081';
}

document.addEventListener('DOMContentLoaded', () => {
    const videoContainers = document.querySelectorAll('.video-container');
    const likeBtn = document.querySelector('.like-btn');
    const followBtn = document.querySelector('.follow-btn');
    const soundToggle = document.querySelector('.sound-toggle');
    let isMuted = true;

    if (deviceInfo.isMobile) {
        document.body.classList.add('mobile');
    } else if (deviceInfo.isDesktop) {
        document.body.classList.add('desktop');
    }

    videoContainers.forEach(container => {
        if (deviceInfo.isMobile) {
            container.addEventListener('touchstart', handleTouchStart);
            container.addEventListener('touchend', handleTouchEnd);
        } else {
            container.addEventListener('click', likeVideo);
        }
    });

    likeBtn.addEventListener('click', likeVideo);

    followBtn.addEventListener('click', () => {
        followBtn.textContent = followBtn.textContent === 'Follow' ? 'Following' : 'Follow';
        followBtn.classList.toggle('following');
    });

    soundToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        document.querySelectorAll('video').forEach(video => {
            video.muted = isMuted;
        });
        soundToggle.innerHTML = isMuted ? '<i class="material-icons">volume_off</i>' : '<i class="material-icons">volume_up</i>';
    });

    if (deviceInfo.isIOS) {
        document.querySelectorAll('video').forEach(video => {
            video.setAttribute('playsinline', '');
        });
    }

    document.addEventListener('scroll', playCurrentVideo);
});

if (deviceInfo.isMobile) {
    document.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, { passive: false });
}

window.addEventListener('resize', () => {
    // Adjust layout or functionality based on new screen size
    // This is where you can add specific adjustments for orientation changes
});

// Lazy loading images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}
