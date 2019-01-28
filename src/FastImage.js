import React from 'react'
import PropTypes, { string } from 'prop-types'
import { Image, StyleSheet, View, ViewPropTypes } from 'react-native'

class FastImage extends React.Component {

  _root

  state = {
    width: 0,
    height: 0
  }

  setNativeProps (nativeProps) {
    this._root.setNativeProps(nativeProps)
  }

  constructor (props) {
    super(props)
  }

  shouldComponentUpdate ({ source, style }, nextState, nextContext) {
    return (
      source.uri !== this.props.source.uri
        || nextState.width !== this.state.width
        || nextState.height !== this.state.height
    )
  }

  static getDerivedStateFromProps ({style}, prevState) {
    return style ? {
      width: style.width,
      height: style.height
    }:{}
  }

  componentDidMount (): void {
    this._componentMounted = true
  }

  componentWillUnmount (): void {
    this._componentMounted = false
  }

  captureRef = e => (this._root = e)

  render () {
    const {
      source,
      onLoadStart,
      onProgress,
      onLoad,
      onError,
      onLoadEnd,
      style,
      children,
      fallback,
      ...props
    } = this.props

    const isEmpty = source.uri !== undefined && String(source.uri) == ''

    if (isEmpty) {
      return (<View style={ [styles.imageContainer, style] } ref={ this.captureRef }>
        { children }
      </View>)
    }

    const resolvedSource = Image.resolveAssetSource(source)

    return (
      <View style={ [styles.imageContainer, style] } ref={ this.captureRef }>
        <Image
          { ...props }
          style={ StyleSheet.absoluteFill }
          source={ resolvedSource }
          onProgress={ onProgress }
          onLoadStart={ onLoadStart }
          onLoad={ onLoad }
          onError={ onError }
          onLoadEnd={ onLoadEnd }
        />
        { children }
      </View>
    )
  }

  static resizeMode = {
    contain: 'contain',
    cover: 'cover',
    stretch: 'stretch',
    center: 'center'
  }

  static priority = {
    // lower than usual.
    low: 'low',
    // normal, the default.
    normal: 'normal',
    // higher than usual.
    high: 'high'
  }

  static prefetch = sources => {
    Image.prefetch(sources)
  }

  static defaultProps = {
    resizeMode: 'cover',
    fadeDuration: 300
  }

  static propTypes = {
    ...ViewPropTypes,
    source: PropTypes.any,
    onLoadStart: PropTypes.func,
    onProgress: PropTypes.func,
    onLoad: PropTypes.func,
    onError: PropTypes.func,
    onLoadEnd: PropTypes.func,
    fallback: PropTypes.bool
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: '#DCDCDC',
    overflow: 'hidden'
  }
})

module.exports = {
  FastImage
}
