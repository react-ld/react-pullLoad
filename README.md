# [react-pullLoad](https://github.com/react-ld/react-pullLoad)
  React 版本的 [pullLoad](https://github.com/lidianhao123/pullLoad) 下拉更新 上拉加载更多 组件

  [pullLoad](https://github.com/lidianhao123/pullLoad) 非 react 版本，支持 require.js 模块化调用

#### 示例
http://lidianhao123.github.io/pullLoad/

# 简介
1. 只依赖 react/react-dom
2. 样式使用 less 编写
3. 支持 body 或者组件根 DOM 固定高度作为外部容器 contianer（即可视区域大小）
4. 触摸事件绑定在内容块 content（即高度为 auto 的DOM ）

# 功能点
1. 下拉距离大于阈值刷新
2. 滚动到距底部距离小于阈值加载更多

# 使用说明

```sh
npm install --save react-pullload
```

```js
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
        <ReactPullLoad
          downEnough={150} 
          onRefresh={this.refresh.bind(this)} 
          onLoadMore={this.loadMore.bind(this)} 
          hasMore={hasMore}>
            <ul className="test-ul">
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
| 参数 | 说明 | 默认值 | 备注 |
| --- | --- | --- | --- |
| onRefresh | 刷新动作的业务逻辑回调函数 | function(resolve, reject){} | 刷新结束执行 resolve(), 出现异常 reject() |
| onLoadMore | 加载更多动作的业务逻辑回调函数 | function(resolve, reject){} | 刷新结束执行 resolve(), 出现异常 reject() |
| hasMore | 是否还有更多内容可加载 | false | 在 onLoadMore reject() 之后设置  |
| downEnough | 下拉距离是否满足要求 | 100 |  |
| distanceBottom | 距离底部距离触发加载更多 | 100 |  |
| isBlockContainer | 是否开启使用组件根 DOM 作为外部容器 contianer | false |  |

另外 ReactPullLoad 组件支持根属性扩展 例如： className\style 等等

# License
MIT
