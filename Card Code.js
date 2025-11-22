function loadData() {
    // Client ID: 29de47bd890d4a0891c357939c78f270
    //Client Secret: VwyFC8fxlKTVCIXth6d7vQdX1xkkwb6a

    const token = "USpwwERggfMgfijKruPt91twXB0Lpxoufu";

    fetch(`https://us.api.blizzard.com/hearthstone/cards?locale=en_US&set=descent-of-dragons&access_token=${token}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log the data to the console for inspection
            // You can add more code here to process and display the data as needed
        })
        .catch(error => console.error('Error fetching data:', error));
    }
    window.onload = loadData;