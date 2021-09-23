import React from 'react';
import Web3 from 'web3';


class Wrapper extends React.Component {
  constructor() {
      super();
      this.state = {
          welcomeMsg: true,
          decision: 'none',
          moveForward: 'false',
      };
  }

  componentDidMount() {
    console.log('Loaded successfully');
  }

  Handler() {

    if (this.state.moveForward === 'false') {
      return this.WelcomeMsg();
    } else {

      switch(this.state.decision) {
        case 'sacrifice':
          return this.Sacrifice();
        
        case 'summoning':
          return this.Summoning();
      }
    }
    
  }

  WelcomeMsg() {

    const dialogueContainer = () => {

        switch (this.state.decision) {
            case 'none':
                return (
                    
                    <div class="css-typing">
                        <p>
                            I'm so glad to see you made it, I thought you wouldn't show up!
                        </p>
                        <p>
                            We're about to get started
                        </p>
                        <p>
                            Did you want to join the <a href="#" onClick={() => { this.setState({decision : 'summoning'}) }}>summoning</a> or <a href="#" onClick={ () => { this.setState({decision : 'sacrifice'}) } }>sacrifice</a>?
                        </p>
                    </div>
                )

            case 'summoning':
                return (
                    
                    <div class="css-typing">
                        <p>
                            Excellent choice!
                        </p>
                        <p>
                            We have scored the best goats blood for our summoning. I hope you have brought your ingredients.
                        </p>
                        <p>
                            Now follow me.
                        </p>
                        <button type="button" onClick={() => { this.setState({moveForward : 'true'}) }}>Follow Satan!</button>
                    </div>
                )

            case 'sacrifice':
                return (
                        <div class="css-typing">
                            <p>
                            The bloodlust on you!
                            </p>
                            <p>
                                Fine, bring your lowley demonz and follow me.
                            </p>
                            <button type="button" onClick={() => { this.setState({moveForward : 'true'}) }}>Follow Satan!</button>
                        </div>
                )
        }

    }


  return (
    <div className="container full">
        <div className="top-spacer"></div>
        <div className="row justify-content-md-center">
                <div className="col-md-6">
                    <div className="card border-dark bg-dark mb-3">
                        <div className="card-body">

                            <div class="row">
                                <div class="col text-center">
                                    <img className="mx-auto d-block" src="/images/satan.gif" alt="Satan the almighty" height="300px" />
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <div className="dialogue-container">
                                            {dialogueContainer()}   
                                    </div>
                                </div>
                            </div>
                        
                        </div>
                    </div>
                </div>
            </div>
    </div>
  );
  }

  Sacrifice() {
    return (
      <p>Lets sacrifice you!</p>
    )
  }

  Summoning() {
    const web3 = new Web3(window.ethereum);
    return (
      <p>Lets sacrifice you!</p>
    )
  }

  render() {
    return (
      this.Handler()
    )
  }
}

export default Wrapper;
