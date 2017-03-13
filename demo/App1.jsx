
import React, { Component, PureComponent, PropTypes } from 'react'
import { render } from 'react-dom'
import ReactPullLoad,{STATS} from 'index.js'
import './App.css'


const defaultStyle ={
  width: "100%",
  textAlign: "center",
  fontSize: "20px",
  lineHeight: "1.5"
}

class HeadNode extends PureComponent{

  static propTypes = {
    loaderState: PropTypes.string.isRequired,
  };

  static defaultProps = {
    loaderState: STATS.init,
  };

  render(){
    const {
      loaderState
    } = this.props

    let content = ""
    if(loaderState == STATS.pulling){
      content = "下拉刷新"
    } else if(loaderState == STATS.enough){
      content = "松开刷新"
    } else if(loaderState == STATS.refreshing){
      content = "正在刷新..."
    } else if(loaderState == STATS.refreshed){
      content = "刷新成功"
    }

    return(
      <div style={defaultStyle}>
        {content}
      </div>
    )
  }
}

class FooterNode extends PureComponent{

  static propTypes = {
    loaderState: PropTypes.string.isRequired,
    hasMore: PropTypes.bool.isRequired
  };

  static defaultProps = {
    loaderState: STATS.init,
    hasMore: true
  };

  render(){
    const {
      loaderState,
      hasMore
    } = this.props

    let content = ""
    if(hasMore === false){
      content = "没有更多"
    } else if(loaderState == STATS.loading && hasMore === true){
      content = "加载中"
    } 

    return(
      <div style={defaultStyle}>
        {content}
      </div>
    )
  }
}


let index = 1;

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
      data: cData,
      action: STATS.init
    }
  }
  //刷新
  refresh(resolve, reject) {
    setTimeout(()=>{
      index = 1;
      this.setState({
        data: cData,
        hasMore: true,
        action: STATS.init
      });
      resolve();
    },3000)
  }
  //加载更多
  loadMore(resolve){
    console.info(index);
    index++
    if(index < 3){
      setTimeout(()=>{
        this.setState({
          data: [...this.state.data, cData[0], cData[0]],
          action: STATS.init
        });
        resolve();
      },3000)
    } else{
      setTimeout(()=>{
        this.setState({
            hasMore: false,
            action: STATS.init
          });
          resolve();
      },3000)
    }
  }
  render(){
    const {data, hasMore} = this.state
    console.info("hasMore = ",hasMore)
    return (
      <div>
        <ReactPullLoad 
          className="block" 
          isBlockContainer={true} 
          downEnough={150}
          action={this.state.action}
          onRefresh={this.refresh.bind(this)}
          onLoadMore={this.loadMore.bind(this)}
          hasMore={hasMore}
          HeadNode={HeadNode}
          FooterNode={FooterNode}
          distanceBottom={1000}>
          <ul className="test-ul">
            <button onClick={() =>{
              this.setState({
                action: STATS.refreshing
              })
              }}>refreshing</button>
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