# [English](./README.md)

# [react-pullLoad](https://github.com/react-ld/react-pullLoad)
  React 版本的 [pullLoad](https://github.com/lidianhao123/pullLoad) 下拉更新 上拉加载更多 组件

  [pullLoad](https://github.com/lidianhao123/pullLoad) 非 react 版本，支持 require.js 模块化调用

#### 示例
[demo1](https://react-ld.github.io/react-pullLoad/index.html) document.body 作为容器

[demo2](https://react-ld.github.io/react-pullLoad/index2.html) ReactPullLoad 根节点 DOM 作为容器

[demo3](https://react-ld.github.io/react-pullLoad/index3.html) document.body 作为容器 且自定义刷新和加载更多 UI 组件

# 当前版本 1.0.4

# 简介
1. 只依赖 react/react-dom
2. 样式使用 less 编写
3. 支持 body 或者组件根 DOM 固定高度作为外部容器 contianer（即可视区域大小）
4. 触摸事件绑定在内容块 content（即高度为 auto 的DOM ）
5. 纯 React 组件方式开发的
6. 支持自定义刷新和加载更多 UI 组件
7. 支持代码动态调起刷新和加载更多（组件将展示刷新和加载更多样式）
8. **只支持移动触摸设备**

# 功能点
1. 下拉距离大于阈值触发刷新动作
2. 滚动到距底部距离小于阈值加载更多
3. 支持自定义刷新和加载更多 UI 组件

# 使用说明

```sh
npm install --save react-pullload
```

```js
import ReactPullLoad,{ STATS } from 'react-pullload'

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

    if(action === STATS.refreshing){//刷新
      this.handRefreshing();
    } else if(action === STATS.loading){//加载更多
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

# 参数说明：
| 参数 | 说明 | 类型 | 默认值 | 备注 |
| --- | --- | --- | --- | --- |
| action | 用于同步状态 | string | | isRequired |
| handleAction | 用于处理状态 | func | | isRequired |
| hasMore | 是否还有更多内容可加载 | bool |false | |
| downEnough | 下拉距离是否满足要求 | num | 100 | |
| distanceBottom | 距离底部距离触发加载更多 | num | 100 |  |
| isBlockContainer | 是否开启使用组件根 DOM 作为外部容器 contianer | bool | false |  |
| HeadNode | 自定义顶部刷新 UI 组件 | any | [ReactPullLoad HeadNode](./src/HeadNode.jsx) | 必须是一个 React 组件 |
| FooterNode | 自定义底部加载更多 UI 组件 | any | [ReactPullLoad FooterNode](./src/FooterNode.jsx) | 必须是一个 React 组件 |

另外 ReactPullLoad 组件支持根属性扩展 例如： className\style 等等


# STATS list

| 属性 | 值 | 根节点 className | 说明 |
| --- | --- | --- | --- |
| init | '' | | 组件初始状态 |
| pulling | 'pulling' | state-pulling | 下拉状态 |
| enough | 'pulling enough' | state-pulling.enough| 下拉并且已经满足阈值 |
| refreshing | 'refreshing' | state-refreshing| 刷新中（加载数据中） |
| refreshed | 'refreshed' | state-refreshed| 完成刷新动作 |
| reset | 'reset' | state-reset| 恢复默认状态 |
| loading | 'loading' | state-loading | 加载中 |

init/reset -> pulling -> enough -> refreshing -> refreshed -> reset

init/reset -> pulling -> reset

init/reset -> loading -> reset

# 自定义刷新及加载组件

请参考默认刷新及加载组件源码（通过 css 根节点不同 className 设置对应 UI 样式来实现）

[ReactPullLoad HeadNode](./src/HeadNode.jsx)

[ReactPullLoad FooterNode](./src/FooterNode.jsx)

或参考 demo3 中的实现方式在组件内容通过获取的 loaderState 与 STATS 不同状态对比来现实

[demo3](https://react-ld.github.io/react-pullLoad/index3.html) 

# License
MIT
