document.addEventListener('DOMContentLoaded', async function () {
  const config = window.MyVideoCarouselConfig || {};
  const {
    width = '141px',
    height = '250px',
    playButtonColor = '#0000FF',
    desiredOrder = [10, 5, 7, 8, 4]
  } = config;

  document.documentElement.style.setProperty('--carousel-width', width);
  document.documentElement.style.setProperty('--carousel-height', height);

  const supabaseUrl = `https://pifcxlqwffdrqcwggoqb.supabase.co/rest/v1/hostedSubs?id=in.(${desiredOrder.join(',')})&select=*`;
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZmN4bHF3ZmZkcnFjd2dnb3FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzMyNjY2NTYsImV4cCI6MTk4ODg0MjY1Nn0.lha9G8j7lPLVGv0IU1sAT4SzrJb0I87LfhhvQV8Tc2Q';

  let data = [];

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

    data.sort((a, b) => desiredOrder.indexOf(a.id) - desiredOrder.indexOf(b.id));

    const carouselContainer = document.getElementById('carousel-container');
    carouselContainer.innerHTML = '';

    data.forEach((item) => {
      const carouselItem = document.createElement('div');
      carouselItem.className = 'carousel-item';
      carouselItem.innerHTML = `<img src="${item.thumbnail}" alt="Thumbnail">`;
      carouselContainer.appendChild(carouselItem);

      carouselItem.addEventListener('click', function () {
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
    muxPlayer.setAttribute('accent-color', playButtonColor);

    overlay.style.display = 'flex';

    muxPlayer.addEventListener('loadedmetadata', function () {
      muxPlayer.play();
    });
  }

  const closeButton = document.querySelector('.vw-cmp__player--button-close');
  closeButton.addEventListener('click', function () {
    const overlay = document.getElementById('fullscreen-overlay');
    overlay.style.display = 'none';

    const muxPlayer = overlay.querySelector('mux-player');
    muxPlayer.pause();
  });

  const overlay = document.getElementById('fullscreen-overlay');
  overlay.style.display = 'none';
});