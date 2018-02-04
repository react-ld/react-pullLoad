
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { STATS } from './constants'

export default class HeadNode extends PureComponent{

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

    return(
      <div className="pull-load-head-default">
        <i/>
      </div>
    )
  }
}