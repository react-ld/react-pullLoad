
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
    //new action must do not equel to old action
    if(action === this.state.action ||
       action === STATS.refreshing && this.state.action === STATS.loading ||
       action === STATS.loading && this.state.action === STATS.refreshing){
      console.info("It's same action or on loading or on refreshing ",action, this.state.action,action === this.state.action);
      return false
    }

    if(action === STATS.refreshing){//刷新
      setTimeout(()=>{
        //refreshing complete
        this.setState({
          data: cData,
          hasMore: true,
          action: STATS.refreshed,
          index: loadMoreLimitNum
        });
      }, 3000)
    } else if(action === STATS.loading){//加载更多      
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
    }

    //DO NOT modify below code
    this.setState({
      action: action
    })
  }
  
  render(){
    const {
      data,
      hasMore
    } = this.state

    return (
      <div>
        <ReactPullLoad 
          className="block"
          isBlockContainer={true}
          downEnough={150}
          action={this.state.action}
          handleAction={this.handleAction}
          hasMore={hasMore}
          distanceBottom={1000}>
          <ul className="test-ul">
            <button onClick={this.handleAction.bind(this, STATS.refreshing)}>refreshing</button>
            <button onClick={this.handleAction.bind(this, STATS.loading)}>loading more</button>
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