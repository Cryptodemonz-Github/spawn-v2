import { useEffect, useState } from "react";
import Welcome from './modules/Welcome';

function Platform( ) {

  const [welcomeMsg, setWelcomeMsg] = useState(true);
  const [startDelay, setStartDelay] = useState(false);


  useEffect(() => {
    setTimeout(function() { 
      setStartDelay(false);
      console.log('set');
    }.bind(this), 5000)

    console.log('loaded')
  });


  const checkWelcome = () => {
    if (startDelay === false) {
      if (welcomeMsg === true) {
        return <Welcome />;
      } else {
        return <p>No Welcome Message</p>;
      }
    }
  }


  return (
    <div className="App">
      <header className="App-header">
          {checkWelcome()}
      </header>
    </div>
  );
}

export default Platform;
