import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import type { ImageProps, ImageState } from './inc'
import { ImageDefaultProps } from './inc'

export class FastImage extends React.Component<ImageProps, ImageState> {

  _root

  state = {
    width: 0,
    height: 0,
    aspectRatio: 0,
    error: false
  }

  _componentMounted: Boolean = false

  setNativeProps (nativeProps) {
    this._root.setNativeProps(nativeProps)
  }

  shouldComponentUpdate ({ source, style }, nextState, nextContext) {
    return (
      (source && source.uri !== this.props.source.uri)
      || nextState.width !== this.state.width
      || nextState.aspectRatio !== this.state.aspectRatio
      || nextState.height !== this.state.height
      || nextState.error !== this.state.error
    )
  }

  componentDidMount (): void {
    this._componentMounted = true
  }

  componentWillUnmount (): void {
    this._componentMounted = false
  }

  static getDerivedStateFromProps ({ style }, prevState) {
    return style ? {
      width: style.width,
      height: style.height
    } : {}
  }

  componentDidMount (): void {
    this._componentMounted = true
  }

  componentWillUnmount (): void {
    this._componentMounted = false
  }

  onLoaded = (evt) => {
    const { width, height } = evt.nativeEvent.source

    if (this._componentMounted && width && height) {
      this.setState({
        aspectRatio: Math.max(Math.min(width / height, this.props.maxRatio),
          this.props.minRatio)
      })
    }
  }

  onErrorHandled = (e) => {
    this.setState({ error: true })

    if (this.props.onError) {
      onError(e)
    }
  }

  captureRef = e => (this._root = e)

  render () {
    const {
      source,
      onLoadStart,
      onProgress,
      onLoad,
      onLoadEnd,
      style = {},
      children,
      fallback,
      onErrorRender,
      themeStyle,
      ...props
    } = this.props

    if (this.state.error && onErrorRender) {
      return onErrorRender()
    }

    const isEmpty = source.uri !== undefined && String(source.uri) == ''

    if (isEmpty) {
      return (<View style={ [styles.imageContainer, themeStyle, style] }
                    ref={ this.captureRef }>
        { children }
      </View>)
    }

    const autoHeight = this.props.autoHeight

    const resolvedSource = Image.resolveAssetSource(source)

    const ratio = {}

    if (autoHeight) {
      if (this.state.aspectRatio) {
        ratio.aspectRatio = this.state.aspectRatio
      } else {
        ratio.aspectRatio = 1
      }
    }

    return (
      <View style={ [styles.imageContainer, themeStyle, style, ratio] }
            ref={ this.captureRef }>
        <Image
          { ...props }
          style={ StyleSheet.absoluteFill }
          source={ resolvedSource }
          onProgress={ onProgress }
          onLoadStart={ onLoadStart }
          onLoad={ (autoHeight && !this.state.aspectRatio) ? this.onLoaded : onLoad }
          onError={ this.onErrorHandled }
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
    ...ImageDefaultProps,
    themeStyle: {}
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: '#DCDCDC',
    overflow: 'hidden'
  }
})
