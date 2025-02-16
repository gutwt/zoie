function revealContent() {
    document.getElementById('overlay').style.display = 'none';
    document.querySelector('.app-container').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('video');
    const likeBtn = document.querySelector('.like-btn');
    const followBtn = document.querySelector('.follow-btn');
    const likeCount = document.querySelector('.like-count');
    let likes = 0;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play();
            } else {
                entry.target.pause();
            }
        });
    }, { threshold: 0.6 });

    videos.forEach(video => {
        observer.observe(video);
        
        // Double-tap to like
        let lastTap = 0;
        video.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 300 && tapLength > 0) {
                likeVideo();
            }
            lastTap = currentTime;
        });
    });

    function likeVideo() {
        likes++;
        likeCount.textContent = likes;
        likeBtn.classList.add('active');
        likeBtn.style.color = '#ff4081';
    }

    likeBtn.addEventListener('click', likeVideo);

    followBtn.addEventListener('click', () => {
        followBtn.textContent = followBtn.textContent === 'Follow' ? 'Following' : 'Follow';
        followBtn.classList.toggle('following');
    });
});
