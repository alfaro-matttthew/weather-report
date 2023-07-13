{/* <div class="col">
          <div>M/DD/YYYY</div>
          <div>Icon</div>
          <div>Temp</div>
          <div>Wind</div>
          <div>Humidity</div>
        </div> */}

$(document).ready (function() {
    var fiveDayForecastEl = $('#fiveDayForecast');
    var weatherAPIKey = "124112a95eeb6b1e4f8f290ab92b20f7";
    var searchHistoryEl = $('#search-history');


    // Reads searches from local storage and returns array of searches objects.
    //OR returns and empty array ([]) if there aren't any projects.
    function readSearchesFromStorage() {
        var searches = localStorage.getItem('searches');
        if (searches) {
            searches = JSON.parse(searches);
        } else {
            searches = [];
        }
        return searches;
    }

    //Takes an array of searchItem and saves them into localstorage
    function saveSearchesToStorage(searchItem) {
        localStorage.setItem('searches', JSON.stringify(searchItem));
    }

    // gets searches data from local storage and displays it
    function printSearchHistory() {
        //clear current list of searches on page
        searchHistoryEl.empty(); // <-----------------------------!! USE THIS TO RESET 5 DAY FORECAST !!
        
        // attaches the array made from readSearchesFromStorage and applies it to searches
        var searches = readSearchesFromStorage();
        
        // loop through each project and create a new li and add it to the list
        for (var i = 0; i < searches.length; i++) {
            var searchedItems = searches[i];
            
            var listEl = $('<li>');

            listEl.addClass('pb-2 fs-4 ')

            listEl.text(searchedItems);
            listEl.attr('style','list-style-type: none');

            searchHistoryEl.append(listEl);
        }
    };


/////////////////////////////////////////////////////////////////////////////////////////////////////////

    function getFiveDayForecastData(cityname) {

        $("#fiveDayForecast").empty();

        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&appid=" + weatherAPIKey + '&units=imperial')
        .then( function(response) {
            return response.json();
        })
        .then( function(data) {
            // console.log(data);
            var selectedDays = [
                data.list[1],
                data.list[9],
                data.list[17],
                data.list[25],
                data.list[33]
            ];
            console.log(selectedDays);

            createTodaysForecast(data);

            createFiveDayForecast(selectedDays[0]);
            createFiveDayForecast(selectedDays[1]);
            createFiveDayForecast(selectedDays[2]);
            createFiveDayForecast(selectedDays[3]);
            createFiveDayForecast(selectedDays[4]);
        })
    }

    function createFiveDayForecast(days) {

        var container = $('<div>');
        var date = $('<div>');
        var icon = $('<img>');
        // var imgLink = 'https://openweathermap.org/img/wn/' +  + '.png'
        var temp = $('<div>');
        var wind = $('<div>');
        var humidity = $('<div>');

        container.addClass("card-kuler card m-2 pt-3 pb-5 shadow-sm");
        date.addClass("text-light fw-bold mb-2");
        temp.addClass("text-light");
        wind.addClass("text-light");
        humidity.addClass("text-light");

        container.addClass('col');
        date.text(dayjs(days.dt_txt).format('MM/DD/YYYY'));
        // icon.attr('src', "'https://openweathermap.org/img/wn/' + icon + '.png'"
        temp.text('Temp: ' + days.main.temp + '° F');
        wind.text('Wind: ' + days.wind.speed + 'mph');
        humidity.text('Humidity ' + days.main.humidity + '%');
    
        container.append(date, icon, temp, wind, humidity);
    
        fiveDayForecastEl.append(container);

    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////

    function getTodayForecastData(cityNameToday) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityNameToday + "&appid=" + weatherAPIKey + '&units=imperial')
        .then( function(response) {
            // console.log(response);
            return response.json();
            
        })
        .then( function(data) {
            // console.log(data);
            

            createTodaysForecast(data);
        })
    }

    function createTodaysForecast(today) {
        var cityNameAndDate = $('#todayCityAndDate');
        var todayTemp = $('#todayTemp');
        var todayWind = $('#todayWind');
        var todayHumidity = $('#todayHumidity');


        // console.log(today);
        cityNameAndDate.text(today.city.name + '(' + dayjs(today.list[0].dt_txt).format('MM/DD/YYYY') + ')');
        todayTemp.text(today.list[0].main.temp + '° F');
        todayWind.text(today.list[0].wind.speed + 'mph');
        todayHumidity.text(today.list[0].main.humidity + '%');
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////

    function handleSearch() {

        var cityname = $('#searchTextBox').val();

        // add searched item to local storage
        var justSearched = readSearchesFromStorage();

        if (!justSearched.includes(cityname)) {
            if (justSearched.length > 5) {
                justSearched.pop();
            }
            justSearched.unshift(cityname);
            saveSearchesToStorage(justSearched);
        }

        getFiveDayForecastData(cityname);
        getTodayForecastData(cityname);
        printSearchHistory();
    }

    $('#searchBtn').on('click', handleSearch);
    
    
})        






        // var container = $('<div>');
        // container.attr('id', 'continerFive');
        // var date = $('<div>');
        // date.attr('id', 'dateFive');
        // var icon = $('<img>');
        // icon.attr('id', 'iconFive');
        // var temp = $('<div>');
        // temp.attr('id', 'tempFive');
        // var wind = $('<div>');
        // wind.attr('id', 'windFive');
        // var humidity = $('<div>');
        // humidity.attr('id', 'humidityFive');

        // $('.fiveContainer #continerFive').remove();
        // $('.fiveContainer #dateFive').remove();
        // $('.fiveContainer #iconFive').remove();
        // $('.fiveContainer #tempFive').remove();
        // $('.fiveContainer #windFive').remove();
        // $('.fiveContainer #humidityFive').remove();

// add this into the DOM for the icon
// .src = "https://openweathermap.org/img/wn/"" + icon + "".png"