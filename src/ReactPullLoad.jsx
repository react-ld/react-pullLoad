import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import './ReactPullLoad.less'

const STATS = {
  init: '',
  pulling: 'pulling',
  enough: 'pulling enough',
  refreshing: 'refreshing',
  refreshed: 'refreshed',
  reset: 'reset',

  loading: 'loading' // loading more
};
const endState = {
  loaderState: STATS.reset,
  pullHeight: 0
};

function addEvent(obj, type, fn) {
  if (obj.attachEvent) {
    obj['e' + type + fn] = fn;
    obj[type + fn] = function () { obj['e' + type + fn](window.event); }
    obj.attachEvent('on' + type, obj[type + fn]);
  } else
    obj.addEventListener(type, fn, false);
}
function removeEvent(obj, type, fn) {
  if (obj.detachEvent) {
    obj.detachEvent('on' + type, obj[type + fn]);
    obj[type + fn] = null;
  } else
    obj.removeEventListener(type, fn, false);
}

export default class ReactPullLoad extends Component {

  constructor(props) {
    super(props)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.container = null
    this.state = {
      loaderState: STATS.init,
      pullHeight: 0
    };
  }

  componentDidMount() {
    this.defaultConfig = {
      container: document.body,//findDOMNode(this),        
      offsetScrollTop: 2,
      offsetY: 75,
      distanceBottom: 100,
      onPullDownMove: this.onPullDownMove.bind(this),
      onPullDownRefresh: this.onPullDownRefresh.bind(this),
      clearPullDownMove: this.clearPullDownMove.bind(this),
      onPullStart: this.onPullStart.bind(this),
      onPullUpMove: this.onPullUpMove.bind(this),
      onPullUpLoad: this.onPullUpLoad.bind(this),
    };
    addEvent(this.refs.container, "touchstart", this.onTouchStart)
    addEvent(this.refs.container, "touchmove", this.onTouchMove)
    addEvent(this.refs.container, "touchend", this.onTouchEnd)
  }
  componentWillUnmount() {
    removeEvent(this.refs.container, "touchstart", this.onTouchStart)
    removeEvent(this.refs.container, "touchmove", this.onTouchMove)
    removeEvent(this.refs.container, "touchend", this.onTouchEnd)
  }
  // 拖拽的缓动公式 - easeOutSine
  easing(distance) {
    // t: current time, b: begInnIng value, c: change In value, d: duration
    var t = distance;
    var b = 0;
    var d = screen.availHeight; // 允许拖拽的最大距离
    var c = d / 2.5; // 提示标签最大有效拖拽距离

    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  }
  canRefresh() {
    return this.props.onRefresh && [STATS.refreshing, STATS.loading].indexOf(this.state.loaderState) < 0;
  }

  onPullDownMove(data) {
    if(!this.canRefresh())return false;

    let loaderState, diff = data[0].touchMoveY - data[0].touchStartY;
    if (diff < 0) {
      diff = 0;
    }
    diff = this.easing(diff);
    if (diff > 100) {
      loaderState = STATS.enough
    } else {
      loaderState = STATS.pulling
    }
    this.setState({
      pullHeight: diff,
      loaderState: loaderState
    })
  }

  onPullDownRefresh() {
    if(!this.canRefresh())return false;

    if (this.state.loaderState === STATS.pulling) {
      this.setState(endState)
    } else {
      this.setState({
        pullHeight: 0,
        loaderState: STATS.refreshing
      })
      if (typeof this.props.onRefresh === "function") {
        this.props.onRefresh(() => {
          console.info("STATS.refreshed")
          this.setState({
            pullHeight: 0,
            loaderState: STATS.refreshed
          })
          setTimeout(()=>{
            this.setState(endState)
          },1000)
        }, () => {
          this.setState(endState)
        })
      }
    }
  }

  clearPullDownMove() {
    if (typeof this.props.clearPullDownMove === "function") {
      this.props.clearPullDownMove();
    }
  }
  onPullStart() {
    if (typeof this.props.onPullStart === "function") {
      this.props.onPullStart();
    }
  }
  onPullUpMove(data) {
    if(!this.canRefresh())return false;
    const { hasMore, onLoadMore} = this.props
    if (typeof this.props.onLoadMore === "function" && hasMore) {
      this.setState({
        pullHeight: 0,
        loaderState: STATS.loading
      })

      // console.info(this.state);
      onLoadMore(()=>{
        this.setState(endState)
      });
    }
  }
  onPullUpLoad() {
  }

  onTouchStart(event) {
    console.info("onTouchStart")
    var targetEvent = event.changedTouches[0];
    this.startX = targetEvent.clientX;
    this.startY = targetEvent.clientY;
  }

  onTouchMove(event) {
    let scrollTop = this.defaultConfig.container.scrollTop,
      scrollH = this.defaultConfig.container.scrollHeight,
      con_H = document.documentElement.clientHeight,//this.defaultConfig.container.clientHeight,
      targetEvent = event.changedTouches[0],
      curX = targetEvent.clientX,
      curY = targetEvent.clientY,
      diffX = curX - this.startX,
      diffY = curY - this.startY;
    // console.info(diffY, (scrollH - scrollTop - con_H))
    //判断垂直移动距离是否大于5 && 横向移动距离小于纵向移动距离
    if (Math.abs(diffY) > 5 && Math.abs(diffY) > Math.abs(diffX)) {
      //滚动距离小于设定值 &&回调onPullDownMove 函数，并且回传位置值
      if (diffY > 5 && scrollTop < this.defaultConfig.offsetScrollTop) {
        //阻止执行浏览器默认动作
        event.preventDefault();
        this.defaultConfig.onPullDownMove([{
          touchStartY: this.startY,
          touchMoveY: curY
        }]);
      } //滚动距离距离底部小于设定值
      else if (diffY < 0 && (scrollH - scrollTop - con_H) < this.defaultConfig.distanceBottom) {
        //阻止执行浏览器默认动作
        // event.preventDefault();
        this.defaultConfig.onPullUpMove([{
          touchStartY: this.startY,
          touchMoveY: curY
        }]);
      }
    }
  }

  onTouchEnd(event) {
    let scrollTop = this.defaultConfig.container.scrollTop,
      scrollH = this.defaultConfig.container.scrollHeight,
      con_H = document.documentElement.clientHeight,//this.defaultConfig.container.clientHeight,
      targetEvent = event.changedTouches[0],
      curX = targetEvent.clientX,
      curY = targetEvent.clientY,
      diffX = curX - this.startX,
      diffY = curY - this.startY;

    //判断垂直移动距离是否大于5 && 横向移动距离小于纵向移动距离
    if (Math.abs(diffY) > 5 && Math.abs(diffY) > Math.abs(diffX)) {
      if (diffY > 5 && scrollTop < this.defaultConfig.offsetScrollTop) {
        //回调onPullDownRefresh 函数，即满足刷新条件
        this.defaultConfig.onPullDownRefresh();
      }
      // else if(diffY < 0 && (scrollH - scrollTop - con_H) < this.defaultConfig.distanceBottom ){
      //   //回调onPullUpLoad 函数，即满足刷新条件
      //   this.defaultConfig.onPullUpLoad();
      // }
      else {
        //回调clearPullDownMove 函数，取消刷新动作
        this.defaultConfig.clearPullDownMove();
      }
    }
  }

  render() {
    let {
        children,
        onRefresh,
        onLoadMore,
        hasMore,
        initializing,
        ...other
    } = this.props

    const {pullHeight, loaderState} = this.state

    const msgStyle = pullHeight ? {
      WebkitTransform: `translate3d(0, ${pullHeight}px, 0)`,
      transform: `translate3d(0, ${pullHeight}px, 0)`
    } : null;

    const symbolTop = pullHeight - 50 > 0 ? pullHeight - 50 : 0;
    const msgStyle2 = pullHeight ? {
      WebkitTransform: `translate3d(0, ${symbolTop}px, 0)`,
      transform: `translate3d(0, ${symbolTop}px, 0)`
    } : null;

    const boxClassName = 'tloader state-' + loaderState;

    return (
      <div className={boxClassName} ref="container">
        <div className="tloader-symbol" style={msgStyle2}>
          <p className="tloader-msg"><i></i></p>
          <p className="tloader-loading">
            <i className="ui-loading"></i>
          </p>
        </div>
        <div className="tloader-body" style={msgStyle}>
          {children}
        </div>
        <div className="tloader-footer">
          { !hasMore ? <p className="tloader-btn"></p> : null}
          <p className="tloader-loading">
            <i className="ui-loading"></i>
          </p>
        </div>
      </div>
    )
  }
}

ReactPullLoad.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func,
  hasMore: PropTypes.bool
  // initializing: PropTypes.string
}