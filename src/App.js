// App.js
import 'es6-promise/auto';
import React from 'react';
import BarChart from './components/BarChart';

const apiUrl = 'http://localhost:8081/v1/chart'; // Replace with your API endpoint

const App = () => {
  return (
    <div>
      <h1>My Chart App</h1>
      <BarChart apiUrl={apiUrl} />
    </div>
  );
};

export default App;