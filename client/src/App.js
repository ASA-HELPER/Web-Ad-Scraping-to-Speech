import React, { useState } from "react";
import axios from 'axios';
import './App.css'

function App() {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading,setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(keyword==='')
    {
      alert('Please enter a valid product name!!!')
      return;
    }
    setLoading(true);
    const response = await axios.post('http://localhost:8080/api/v1/scrape', {keyword});
    if(response===null)
    {
      alert("No shopping add is present.");
    }
    else
    {
      alert(response.data.message);
    }
    setResult(response.data);
    if(response.data.Name===undefined)
    {
      alert(response.data.message);
      setResult(null);
    }
    setKeyword('')
    setLoading(false);
  };

  const handleClick = ()=>{
    const speech = new SpeechSynthesisUtterance(result?.audioText);
    window.speechSynthesis.speak(speech);
  }

  return (
    <div className="content">
      <div>
        <form onSubmit={handleSubmit}>
        <label for="fname" className="labelName">Write the product name</label><br></br>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            size="40"
          />
          <button type="submit">Search</button>
          <br></br>
        </form>
      </div>
      {result && !isLoading && (
        <div className="result">
          <img src={result?.Image} alt={result?.name} />
          <br></br>
          <p>The price of {result?.Name} is rupees {result?.Price}.</p>
          <br></br>
          <button onClick={handleClick}>Speak</button>
        </div>
      )}
      {isLoading && (<p className="labelName">Loading....</p>)}
    </div>
  );
}

export default App;
