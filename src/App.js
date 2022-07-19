import { useEffect, useState } from 'react'
import './App.css';
import { myKey } from './Components/api-key';
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    
  },
  animations: {
    tension: {
      duration: 1000,
      easing: 'linear',
      from: 1,
      to: 0,
      loop: true
    }
  },
  scales: {
    yAxes:{
        grid: {
            drawBorder: true,
            color: '#FFFFFF',
        },
        ticks:{
            beginAtZero: true,
            fontColor: 'white'
        }
    },
    xAxes: {
        grid: {
            drawBorder: true,
            color: '#FFFFFF',
        },
        ticks:{
            beginAtZero: true,
            fontColor: 'white'
        }
    },
}
};

function App() {
  const [weatherData, setWeatherData] = useState([])
  const [current, setCurrent] = useState()
  const [weeksWeatherData, setweeksWeatherData] = useState([])

  const func = () => {
    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=40.7648&lon=-73.9808&appid=${myKey}&units=metric`)
    .then(res => {
      setWeatherData(res.data.daily)
      setCurrent(res.data.current)
    })
  }

  useEffect(() => {
    func()
  }, [])

  useEffect(() => {
    if(weatherData.length > 0) {
      let final = {}
      let temp = []
      let labelsTemp = []
        let objMax = {
          label: "Maximum Temperature",
          data: [],
          backgroundColor: `red`,
          borderColor: `red`,
        }

        let objMin = {
          label: "Minimum Temperature",
          data: [],
          backgroundColor: `blue`,
          borderColor: `blue`,
        }

      let weekMaxTemp = []
      let weekMinTemp = []

      weatherData.forEach(i => {
        weekMaxTemp.push(i.temp.max)
        weekMinTemp.push(i.temp.min)
        labelsTemp.push(new Date(i.dt*1000).toLocaleDateString('en-US', { weekday: 'long' }))
      })

      objMax.data = weekMaxTemp
      objMin.data = weekMinTemp
        temp.push(objMax)
        temp.push(objMin)
      final.datasets = temp
      final.labels = labelsTemp

      setweeksWeatherData(final)
    }
  }, [weatherData])

  return (
    <div className="App">
      
      <div className='weather-card'>
        {
          weatherData && weatherData.length > 0 && 
          <>
            <div>New York</div>
            <div id="current-temp">{current.temp}&#176;C</div>

            <div id="description">{current.weather[0].description}</div>
            <div className='temp'>Maximum: {weatherData[0].temp.max}&#176;C</div>
            <div className='temp'>Minimum: {weatherData[0].temp.min}&#176;C</div>
          </>
        }
      </div>
      <div>
        {
          weatherData && weatherData.length > 0 &&
            <div className='random'>
              <div>
                <i class="fa-solid fa-wind"></i> {current.wind_speed}
              </div>
              <div>
                <i class="fa-solid fa-droplet"></i> {current.humidity}
              </div>
              <div>
              <i class="fa-solid fa-arrows-to-circle"></i> {current.pressure}
              </div>
              <div>
                <i class="fa-solid fa-sun"></i> {new Date(current.sunrise*1000).toLocaleTimeString()}
              </div>
              <div>
                <i class="fa-regular fa-sun"></i> {new Date(current.sunset*1000).toLocaleTimeString()}
              </div>
            </div>
        }
      </div>
      {
        weeksWeatherData && weeksWeatherData.datasets &&  (
          <div className='chart'>
             <Line options={options} data={weeksWeatherData} />
          </div>
        )
      }
      
    </div>
  );
}

export default App;
