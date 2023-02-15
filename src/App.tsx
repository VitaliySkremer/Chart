import {Chart} from "./Chart/Chart";

function App() {
  return (
    <div className='app'>
      <div className='wrapper'>
        <Chart
          nitValue={234840}
          nitMax={246051}
          forecastValue={272289}
          forecastMax={283500}
        />
      </div>
    </div>
  )
}

export default App
