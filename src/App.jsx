import axios from 'axios';
import React, { useState } from 'react';
import './App.css';
import Search from 'antd/es/input/Search';
import { format } from 'date-fns';
import { MoonFilled, SunOutlined } from '@ant-design/icons';

function App() {
  const [currentTime, setCurrentTime] = useState(null);
  const [cityName, setCityName] = useState('');
  const [temp, setTemp] = useState('');
  const [wind, setWind] = useState('');
  const [humidity, setHumidity] = useState('');
  const [des, setDes] = useState('');
  const [press, setPress] = useState('');
  const [isLightMode, setIsLightMode] = useState(false); 
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = '40e5781723a2688955f5c67581660dc2';

  const formatDateTime = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${dayName} ${monthName} ${day} ${year} ${hours}:${minutes}:${seconds}`;
  };

  async function getWeather(e) {
    setLoading(true)
    let res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${e}&appid=${apiKey}`);
    
   
    setCurrentTime(formatDateTime(new Date()));
    setCityName(res.data.name);
    setTemp((Math.floor(res.data.main.temp) - 273) + '°c');
    setWind('Wind Speed: ' + (res.data.wind.speed) + ' km/hr');
    setHumidity('Humidity: ' + res.data.main.humidity + '%');
    setDes('Description: ' + res.data.weather[0].description);
    setPress("Pressure: " + res.data.main.pressure + ' millibars');
    setRecent((prevRecent) => [...new Set([res.data.name, ...prevRecent])]); 

    setLoading(false)
  }

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
  };

  return (
    <div className={isLightMode ? 'light-mode' : 'dark-mode'}>
      <div className='pg'>
        <div className='pgimg'>
          <p className='date'>{currentTime}</p>
          <p className='temp'>{temp}</p>
        </div>

        <div className='theme'>
          <div style={{ color: isLightMode ? 'black' : 'white' }}>
            <p onClick={toggleTheme}>
              {isLightMode ? <MoonFilled /> : <SunOutlined />}
              {isLightMode ? 'Dark mode' : 'Light mode'}
            </p>
          </div>
          <div className='search'>
            <Search placeholder="Enter city name or zip code" loading={loading} enterButton onSearch={(e) => getWeather(e)} />
          </div> 
          <br />
          <div>
            <p className='city'>{cityName}</p>
            <hr />
            <p className='city'>{wind}</p>
            <hr />
            <p className='city'>{humidity}</p>
            <hr />
            <p className='city'>{des}</p>
            <hr />
            <p className='city'>{press}</p>
            <hr />
          </div>
          <div>
            <h2>Recent Searches</h2>
            <ul>
              {
                recent.map((item,i)=>{
                  return <li key={i+1}>{item}</li>
                })
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

