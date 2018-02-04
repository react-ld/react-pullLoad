# [中文](./README-cn.md)

# [react-pullLoad](https://github.com/react-ld/react-pullLoad)
  Refreshing and Loading more component for react.

  [pullLoad](https://github.com/lidianhao123/pullLoad) is another refreshing and loading more lib without react, support require.js to load lib.

#### examples
[demo1](https://react-ld.github.io/react-pullLoad/index1.html) use ReactPullLoad root DOM as container

[demo2](https://react-ld.github.io/react-pullLoad/index2.html) use ReactPullLoad root DOM as container

[demo3](https://react-ld.github.io/react-pullLoad/index3.html) use document.body as container, and config UI component (HeadNode and FooterNode).

[demo4](https://react-ld.github.io/react-pullLoad/index4.html) forbidden pull refresh

# version 1.1.0

# Description
1. Only depend on react/react-dom, without any other package.
2. Use less.
3. Support body or root Dom as container.
4. Bind touch event on component root Dom.
5. It.s develop as Pure react component.
6. Support config UI component (HeadNode and FooterNode).
7. Can apply refreshing or loading through modify STATE.
8. **Only support mobile device**

# How to use

```sh
npm install --save react-pullload
```

```js
import ReactPullLoad,{ STATS } from 'react-pullload'
import 'node_modules/react-pullload/dist/ReactPullLoad.css'

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
    if(action === this.state.action){
      return false
    }

    if(action === STATS.refreshing){
      this.handRefreshing();
    } else if(action === STATS.loading){
      this.handLoadMore();
    } else{
      //DO NOT modify below code
      this.setState({
        action: action
      })
    }
  }

  handRefreshing = () =>{
    if(STATS.refreshing === this.state.action){
      return false
    }

    setTimeout(()=>{
      //refreshing complete
      this.setState({
        data: cData,
        hasMore: true,
        action: STATS.refreshed,
        index: loadMoreLimitNum
      });
    }, 3000)

    this.setState({
      action: STATS.refreshing
    })
  }

  handLoadMore = () => {
    if(STATS.loading === this.state.action){
      return false
    }
    //无更多内容则不执行后面逻辑
    if(!this.state.hasMore){
      return;
    }

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

    this.setState({
      action: STATS.loading
    })
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

    return (
      <div>
        <div style={fixHeaderStyle}>
          fixed header    
        </div>
        <ReactPullLoad 
          downEnough={150}
          action={this.state.action}
          handleAction={this.handleAction}
          hasMore={hasMore}
          style={{paddingTop: 50}}
          distanceBottom={1000}>
          <ul className="test-ul">
            <button onClick={this.handRefreshing}>refreshing</button>
            <button onClick={this.handLoadMore}>loading more</button>
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
```

# API：
| Property | Description | Type | default | Remarks |
| --- | --- | --- | --- | --- |
| action | sync component status | string | | isRequired |
| handleAction | handle status | func | | isRequired |
| hasMore | flag for are there any more content to load | bool |false | |
| downEnough | how long distance is enough to refreshing | num | 100 | use px as unit |
| distanceBottom | current position is apart from bottom | num | 100 | use px as unit |
| isBlockContainer | set root dom as container | bool | false |  |
| HeadNode | custom header UI compoent | any | [ReactPullLoad HeadNode](./src/HeadNode.jsx) | must be a react component |
| FooterNode | custom footer UI compoent | any | [ReactPullLoad FooterNode](./src/FooterNode.jsx) | must be a react component |

Remarks: ReactPullLoad support set root dom className and style.


# STATS list

| Property | Value | root className | explain |
| --- | --- | --- | --- |
| init | '' | | component initial status |
| pulling | 'pulling' | state-pulling | pull status |
| enough | 'pulling enough' | state-pulling.enough| pull down enough status |
| refreshing | 'refreshing' | state-refreshing| refreshing status fetch data |
| refreshed | 'refreshed' | state-refreshed| refreshed |
| reset | 'reset' | state-reset| reset status |
| loading | 'loading' | state-loading | fetching data |

init/reset -> pulling -> enough -> refreshing -> refreshed -> reset

init/reset -> pulling -> reset

init/reset -> loading -> reset

# Custom UI components

Please refer to the default HeadNode and FooterNode components

[ReactPullLoad HeadNode](./src/HeadNode.jsx)

[ReactPullLoad FooterNode](./src/FooterNode.jsx)

Or refer to demo3, show different dom style through compare props loaderState width STATS.

[demo3](https://react-ld.github.io/react-pullLoad/index3.html) 

# License
MIT
