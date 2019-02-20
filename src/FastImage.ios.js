import React, { Component } from 'react'
import { Image, NativeModules, requireNativeComponent, StyleSheet, View } from 'react-native'

const FastImageViewNativeModule = NativeModules.FastImageView

export class FastImage extends Component<{
  source: { uri: String, headers?: Object, priority?: String },
  onLoadStart: Function,
  onProgress: Function,
  onLoad: Function,
  onError: Function,
  onLoadEnd: Function,
  fallback: Function
}, {
  width: Number,
  height: Number
}> {

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

  captureRef = ref => (this._root = ref)

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

    const resolvedSource = Image.resolveAssetSource(source)

    if (fallback) {
      return (
        <View
          style={ [styles.imageContainer, style] }
          ref={ this.captureRef }
        >
          <FastImageView
            { ...props }
            style={ StyleSheet.absoluteFill }
            source={ resolvedSource }
            onLoadStart={ onLoadStart }
            onProgress={ onProgress }
            onLoad={ onLoad }
            onError={ onError }
            onLoadEnd={ onLoadEnd }
          />
          { children }
        </View>
      )
    }

    return (
      <View style={ [styles.imageContainer, style] } ref={ this.captureRef }>
        <FastImageView
          { ...props }
          style={ StyleSheet.absoluteFill }
          source={ resolvedSource }
          onFastImageLoadStart={ onLoadStart }
          onFastImageProgress={ onProgress }
          onFastImageLoad={ onLoad }
          onFastImageError={ onError }
          onFastImageLoadEnd={ onLoadEnd }
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

  static cacheControl = {
    // Ignore headers, use uri as cache key, fetch only if not in cache.
    immutable: 'immutable',
    // Respect http headers, no aggressive caching.
    web: 'web',
    // Only load from cache.
    cacheOnly: 'cacheOnly'
  }

  static preload = sources => {
    FastImageViewNativeModule.preload(sources)
  }

  static defaultProps = {
    resizeMode: FastImage.resizeMode.cover
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
