var APIKey="a6018ebd065c42339e85136a304a1ed4";
var city="";
var citySearch = $("#city-search-field");
var searchBtn = $("#search-button");
var clearBtn = $("#clear-button");
var cityMain = $("#city-main");
var temperature = $("#temperature");
var humidity= $("#humidity");
var windSpeed=$("#wind-speed");
var uvIndex= $("#uv-index");
var allCities=[];

// find city from all cities
function find(selection){
    for (var i=0; i < allCities.length; i++){
        if(selection.toUpperCase()===allCities[i]){
            return -1;
        }
    }
    return 1;
}
// show searched for weather
function showWeather(event){
    event.preventDefault();
    if(citySearch.val().trim()!==""){
        city=citySearch.val().trim();
        currentWeather(city);
    }
}

function currentWeather(city){
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;

    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){

        console.log(response);
        var icon= response.weather[0].icon;
        var iconURL="https://openweathermap.org/img/wn/"+icon +"@2x.png";
        var date=new Date(response.dt*1000).toLocaleDateString();
        $(cityMain).html(response.name +"<img src="+iconURL+">");
        // convert to F
        var fahrenheit = (response.main.temp - 273.15) * 1.80 + 32;
        $(temperature).html((fahrenheit).toFixed(0)+" F");
        
        $(humidity).html(response.main.humidity+"%");
        
        var windSpeedNoConversion=response.wind.speed;
        var windSpeedToMPH=(windSpeedNoConversion*2.237).toFixed(1);
        $(windSpeed).html(windSpeedToMPH+" mph");
        
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod==200){
            allCities=JSON.parse(localStorage.getItem("cityname"));
            console.log(allCities);
            if (allCities==null){
                allCities=[];
                allCities.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(allCities));
                addToSearchedCities(city);
            }
            else {
                if(find(city)>0){
                    allCities.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(allCities));
                    addToSearchedCities(city);
                }
            }
        }
    });
}

function UVIndex(ln,lt){
    var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                $(uvIndex).html(response.value);
            });
}
    
// 5 day forecast
function forecast(cityFiveDay){
    var queryURLforecast="https://api.openweathermap.org/data/2.5/forecast?id="+cityFiveDay+"&appid="+APIKey;
    
    $.ajax({
        url:queryURLforecast,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconURL="https://openweathermap.org/img/wn/"+iconcode+".png";
            var kelvinTemp= response.list[((i+1)*8)-1].main.temp;
            var fahrenheit=(((kelvinTemp-273.5)*1.80)+32).toFixed(0);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
        
            $("#fiveDayDate"+i).html(date);
            $("#fiveDayIcon"+i).html("<img src="+iconURL+">");
            $("#fiveDayTemp"+i).html(fahrenheit+" F");
            $("#fiveDayHumidity"+i).html(humidity+"%");
        }        
    });
}

function addToSearchedCities(c){
    var searchedCities= $("<li>"+c.toUpperCase()+"</li>");
    $(searchedCities).attr("class","list-searched-cities-item");
    $(searchedCities).attr("data-value",c.toUpperCase());
    $(".list-searched-cities").append(searchedCities);
}
function clearHistory(event){
    // couldn't figure it outz
}

$("#search-button").on("click",showWeather);
$(document).on("click",invokePastSearch);
$("#clear-button").on("click",clearHistory);





















