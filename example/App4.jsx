
import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types';
import { render } from 'react-dom'
import ReactPullLoad,{STATS} from 'index.js'
import '../src/ReactPullLoad.less'
import './App.css'

const defaultStyle ={
  width: "100%",
  textAlign: "center",
  fontSize: "20px",
  lineHeight: "1.5"
}

const loadMoreLimitNum = 2;

const cData = [
    "http://img1.gtimg.com/15/1580/158031/15803178_1200x1000_0.jpg",
    "http://img1.gtimg.com/15/1580/158031/15803179_1200x1000_0.jpg",
    "http://img1.gtimg.com/15/1580/158031/15803181_1200x1000_0.jpg",
    "http://img1.gtimg.com/15/1580/158031/15803182_1200x1000_0.jpg",
    "http://img1.gtimg.com/15/1580/158031/15803183_1200x1000_0.jpg",
    // "http://img1.gtimg.com/15/1580/158031/15803184_1200x1000_0.jpg",
    // "http://img1.gtimg.com/15/1580/158031/15803186_1200x1000_0.jpg"
]

export class App extends Component{
  constructor(){
    super();
    this.state ={
      hasMore: true,
      data: cData,
      action: STATS.init,
      index: loadMoreLimitNum //loading more test time limit
    }
  }

  handleAction = (action) => {
    console.info(action, this.state.action,action === this.state.action);
    if(action !== STATS.loading){
      return false;
    }

    this.setState({
      hasMore: true
    });
    setTimeout(()=>{
      if(this.state.index === 0){
        this.setState({
          action: STATS.reset,
          hasMore: false
        });
      } else{
        this.setState({
          data: [...this.state.data, cData[0], cData[0]],
          action: STATS.reset,
          index: this.state.index - 1
        });
      }
    }, 3000)

    //DO NOT modify below code
    this.setState({
      action: action
    })
  }

  getScrollTop = ()=>{
    if(this.refs.reactpullload){
      console.info(this.refs.reactpullload.getScrollTop());
    }
  }
  setScrollTop = ()=>{
    if(this.refs.reactpullload){
      console.info(this.refs.reactpullload.setScrollTop(100));
    }
  }
  
  render(){
    const {
      data, 
      hasMore
    } = this.state

    const fixHeaderStyle = {
      position: "fixed",
      width: "100%",
      height: "50px",
      color: "#fff",
      lineHeight: "50px",
      backgroundColor: "#e24f37",
      left: 0,
      top: 0,
      textAlign: "center",
      zIndex: 1
    }

    const fixButtonStyle = {
      position: "fixed",
      top: 200,
      width: "100%",
    }

    return (
      <div>
        <div style={fixHeaderStyle}>
          fixed header    
        </div>
        <ReactPullLoad 
          downEnough={150}
          ref="reactpullload"
          className="block"
          isBlockContainer={true}
          action={this.state.action}
          handleAction={this.handleAction}
          hasMore={hasMore}
          style={{paddingTop: 50}}
          distanceBottom={1000}>
          <ul className="test-ul">
            <button onClick={this.handleAction.bind(this, STATS.refreshing)}>refreshing</button>
            <button onClick={this.handleAction.bind(this, STATS.loading)}>loading more</button>
            <div style={fixButtonStyle}>
              <button onClick={this.getScrollTop}>getScrollTop</button>
              <button onClick={this.setScrollTop}>setScrollTop</button>
            </div>
            {
              data.map( (str, index )=>{
                return <li key={index}><img src={str} alt=""/></li>
              })
            }
          </ul>
        </ReactPullLoad>
      </div>
    )
  }
}

render(
  <App />,
  document.getElementById('root')
)