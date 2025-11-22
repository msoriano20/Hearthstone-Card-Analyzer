function loadData() {
    fetch('https://us.api.blizzard.com/hearthstone/cards?locale=en_US&set=descent-of-dragons')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log the data to the console for inspection
            // You can add more code here to process and display the data as needed
        })
        .catch(error => console.error('Error fetching data:', error));
    }
    window.onload = loadData;