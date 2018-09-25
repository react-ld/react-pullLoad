import * as React from "react";
declare enum STATS {
  init = "",
  pulling = "pulling",
  enough = "pulling enough",
  refreshing = "refreshing",
  refreshed = "refreshed",
  reset = "reset",

  loading = "loading" // loading more
}

export interface PullLoadProps {
  action: STATS; //用于同步状态
  handleAction: (action: STATS) => void; //用于处理状态
  hasMore: boolean; //是否还有更多内容可加载
  offsetScrollTop?: number; //必须大于零，使触发刷新往下偏移，隐藏部分顶部内容
  downEnough?: number; //下拉满足刷新的距离
  distanceBottom?: number; //距离底部距离触发加载更多
  isBlockContainer?: boolean;

  HeadNode?: React.ReactNode | string; //refresh message react dom
  FooterNode?: React.ReactNode | string; //refresh loading react dom
  children: React.ReactChild; // 子组件
}
export default class ReactPullLoad extends React.Component<
  PullLoadProps,
  any
> {}
