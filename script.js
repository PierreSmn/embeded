async function initializeVideoCarousel(config) {
  console.log("Initializing Video Carousel with config:", config);

  const supabaseUrl = `https://pifcxlqwffdrqcwggoqb.supabase.co/rest/v1/hostedSubs?id=in.(${config.desiredOrder.join(',')})&select=*`;
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZmN4bHF3ZmZkcnFjd2dnb3FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzMyNjY2NTYsImV4cCI6MTk4ODg0MjY1Nn0.lha9G8j7lPLVGv0IU1sAT4SzrJb0I87LfhhvQV8Tc2Q';

  let data = [];
  let currentIndex = 0;
  
  try {
    const response = await fetch(supabaseUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    data = await response.json();
    console.log('Fetched data:', data);

    data.sort((a, b) => config.desiredOrder.indexOf(a.id) - config.desiredOrder.indexOf(b.id));

    const carouselContainer = document.getElementById('carousel-container');
    carouselContainer.innerHTML = '';

    data.forEach((item, index) => {
      const carouselItem = document.createElement('div');
      carouselItem.className = 'carousel-item';
      carouselItem.innerHTML = `
        <img src="${item.thumbnail}" alt="Thumbnail">
        <div class="play-button-overlay" style="background-color: rgba(0, 0, 0, 0.5)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="${config.playButtonColor}" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 5v14l11-7-11-7z"/>
          </svg>
        </div>`;
      carouselContainer.appendChild(carouselItem);

      carouselItem.addEventListener('click', function () {
        currentIndex = index;
        openOverlay(item);
      });
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('carousel-container').innerHTML = 'Failed to load data.';
  }

  function openOverlay(item) {
    const overlay = document.getElementById('fullscreen-overlay');
    const muxPlayer = overlay.querySelector('mux-player');

    muxPlayer.setAttribute('playback-id', item.playback_id);
    muxPlayer.setAttribute('metadata-video-title', item.title);
    muxPlayer.setAttribute('metadata-viewer-user-id', 'user');

    overlay.style.display = 'flex';

    muxPlayer.addEventListener('loadedmetadata', function () {
      muxPlayer.play();
    });
  }

  function playNextVideo() {
    currentIndex = (currentIndex + 1) % data.length;
    openOverlay(data[currentIndex]);
  }

  function playPreviousVideo() {
    currentIndex = (currentIndex - 1 + data.length) % data.length;
    openOverlay(data[currentIndex]);
  }

  const closeButton = document.querySelector('.vw-cmp__player--button-close');
  closeButton.addEventListener('click', function () {
    const overlay = document.getElementById('fullscreen-overlay');
    overlay.style.display = 'none';

    const muxPlayer = overlay.querySelector('mux-player');
    muxPlayer.pause();
  });

  const nextButton = document.querySelector('.vw-cmp__player--button-next');
  nextButton.addEventListener('click', playNextVideo);

  const prevButton = document.querySelector('.vw-cmp__player--button-prev');
  prevButton.addEventListener('click', playPreviousVideo);

  const overlay = document.getElementById('fullscreen-overlay');
  overlay.style.display = 'none';
}
