(function() {
  window.MyVideoCarouselConfig = window.MyVideoCarouselConfig || {
    width: '141px',
    height: '250px',
    playButtonColor: '#0000FF',
    desiredOrder: [10, 5, 7, 8, 4]
  };

  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@mux/mux-player';
  script.async = true;
  document.head.appendChild(script);

  var supabaseScript = document.createElement('script');
  supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js';
  supabaseScript.async = true;
  document.head.appendChild(supabaseScript);

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://embeded-pi.vercel.app/styles.css'; // Update with your Vercel URL
  document.head.appendChild(link);

  var customScript = document.createElement('script');
  customScript.src = 'https://embeded-pi.vercel.app/script.js'; // Update with your Vercel URL
  customScript.async = true;
  customScript.onload = function() {
    if (typeof initializeVideoCarousel === 'function') {
      initializeVideoCarousel(window.MyVideoCarouselConfig);
    }
  };
  document.head.appendChild(customScript);

  var container = document.createElement('div');
  container.id = 'carousel-container';
  document.body.appendChild(container);

  var overlay = document.createElement('div');
  overlay.className = 'fullscreen-overlay';
  overlay.id = 'fullscreen-overlay';
  overlay.innerHTML = `
    <mux-player
      class="fullscreen-video"
      playback-id=""
      metadata-video-title=""
      metadata-viewer-user-id="user"
      accent-color="#0000FF"
    ></mux-player>
    <div class="vw-cmp__player--button-close vw-cmp__player--button" tabindex="0" aria-label="Close dialog" role="button">
      <span class="vw-cmp__player--button-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0002 10.586L4.70718 3.29297L3.29297 4.70718L10.586 12.0002L3.29297 19.2933L4.70718 20.7075L12.0002 13.4145L19.2933 20.7075L20.7075 19.2933L13.4145 12.0002L20.7075 4.70723L19.2933 3.29302L12.0002 10.586Z" fill="white"></path>
      </svg>
    </span>
    </div>
  `;
  document.body.appendChild(overlay);
})();
