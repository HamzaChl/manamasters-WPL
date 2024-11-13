export const pingWebsites = () => {
    const urls = [
        'https://wpl-project.onrender.com',
        'https://adminui-jk6j.onrender.com'
    ];
    urls.forEach(url => {
      fetch(url)
        .then(response => {
          if (response.ok) {
            console.log(`Pinging ${url} succesvol om actief te houden.`);
          } else {
            console.log(`Kon ${url} niet bereiken:`, response.status);
          }
        })
        .catch(error => console.error(`Fout bij het pingen van ${url}:`, error));
    });
  };