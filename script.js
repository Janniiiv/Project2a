const form = document.querySelector('.movie-form');
    const container = document.querySelector('.image-container');
    const theaterSelect = document.querySelector('#theater');

    async function fetchMovies(theaterId) {
      const url = `https://www.finnkino.fi/xml/Schedule/?area=${encodeURIComponent(theaterId)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

      const shows = Array.from(xmlDoc.getElementsByTagName('Show'));
      const titles = shows
        .map(show => show.getElementsByTagName('Title')[0]?.textContent?.trim())
        .filter(Boolean);

      return [...new Set(titles)];
    }

    function renderMovies(movies) {
      container.innerHTML = '';

      if (!movies.length) {
        container.textContent = 'No movies found.';
        return;
      }

      for (const title of movies) {
        const p = document.createElement('p');
        p.textContent = title;
        container.appendChild(p);
      }
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const theaterId = theaterSelect.value;
      if (!theaterId) return;

      container.textContent = 'Loading...';

      try {
        const movies = await fetchMovies(theaterId);
        renderMovies(movies);
      } catch (err) {
        console.error(err);
        container.textContent = `Error: ${err.message}`;
      }
    });
