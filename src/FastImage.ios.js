import React from 'react'
import { Image, NativeModules, requireNativeComponent, StyleSheet, View } from 'react-native'
import type { ImageProps, ImageState } from './inc'

const FastImageViewNativeModule = NativeModules.FastImageView

export class FastImage extends React.Component<ImageProps, ImageState> {

  _root

  state = {
    width: 0,
    height: 0
  }

  _componentMounted: Boolean = false

  setNativeProps (nativeProps) {
    this._root.setNativeProps(nativeProps)
  }

  shouldComponentUpdate ({ source, style }, nextState, nextContext) {
    return (
      source.uri !== this.props.source.uri
      || style !== this.props.style
      || nextState.width !== this.state.width
      || nextState.height !== this.state.height
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
}

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: '#DCDCDC',
    overflow: 'hidden'
  }
})

const FastImageView = requireNativeComponent('FastImageView', FastImage, {
  nativeOnly: {
    onFastImageLoadStart: true,
    onFastImageProgress: true,
    onFastImageLoad: true,
    onFastImageError: true,
    onFastImageLoadEnd: true
  }
})
