import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import ReactPullLoad from 'ReactPullLoad'
import './App.css'

const cData = [
    "http://img1.gtimg.com/15/1580/158031/15803178_1200x1000_0.jpg",
    "http://img1.gtimg.com/15/1580/158031/15803179_1200x1000_0.jpg",
    "http://img1.gtimg.com/15/1580/158031/15803181_1200x1000_0.jpg",
    "http://img1.gtimg.com/15/1580/158031/15803182_1200x1000_0.jpg",
    "http://img1.gtimg.com/15/1580/158031/15803183_1200x1000_0.jpg",
    "http://img1.gtimg.com/15/1580/158031/15803184_1200x1000_0.jpg",
    "http://img1.gtimg.com/15/1580/158031/15803186_1200x1000_0.jpg"
]

export class App extends Component{
  constructor(){
    super();
    this.refreshResolve = null //用于保存刷新或者加载更多的resolve函数
    this.loadMore = this.loadMore.bind(this);
    this.refresh = this.refresh.bind(this);
    this.state ={
      hasMore: true,
      data: cData
    }
  }
  //刷新
  refresh(resolve, reject) {
    setTimeout(()=>{
      this.setState({
        data: cData
      });
      resolve();
    },3000)
  }
  //加载更多
  loadMore(resolve){
    setTimeout(()=>{
      this.setState({
        data: [...this.state.data, cData[0], cData[0]]
      });
      resolve();
    },3000)
  }
  render(){
    const {data, hasMore} = this.state
    return (
      <div>
        <ReactPullLoad onRefresh={this.refresh.bind(this)} onLoadMore={this.loadMore.bind(this)} hasMore={hasMore}>
          <ul className="test-ul">
            {
              data.map( str =>{
                return <li key={str}><img src={str} alt=""/></li>
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