import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import type { ImageProps, ImageState } from './inc'
import { ImageDefaultProps } from './inc'

const RATIO_DECIMAL_PLACES = 2

const computeRatioFromPropsAndState = (props, state) => {
  const { autoHeight, aspectRatio: ratioProp, style = {} } = props
  const { aspectRatio: ratioState } = state

  let computedRatio = 0

  // Ratio priority from less -> important

  // 1. style
  if (style?.width && style?.height) {
    computedRatio = parseFloat((style.width / style.height).toFixed(RATIO_DECIMAL_PLACES))
  } else {
    computedRatio = 0
  }

  // 2. prop
  if (ratioProp) {
    computedRatio = parseFloat(ratioProp.toFixed(RATIO_DECIMAL_PLACES))
  }

  // 3. state
  if (autoHeight && ratioState) {
    computedRatio = parseFloat(ratioState.toFixed(RATIO_DECIMAL_PLACES))
  } else if (autoHeight && !ratioState && !computedRatio) {
    computedRatio = 1.000
  }

  return computedRatio
}

export class FastImage extends React.Component<ImageProps, ImageState> {

  _root

  state = {
    error: false,
    aspectRatio: 0,
  }

  _componentMounted: Boolean = false

  setNativeProps (nativeProps) {
    this._root.setNativeProps(nativeProps)
  }

  get resovledResource() {
    const { source } = this.props

    return Image.resolveAssetSource(source)
  }

  get computedRatioStyle() {
    const computeRatio = computeRatioFromPropsAndState(this.props, this.state)

    return computeRatio ? { aspectRatio: computeRatio } : {}
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { error } = this.state
    const { source, style } = this.props

    const { source: nextSource, style: nextStyle } = nextProps

    const aspectRatio = computeRatioFromPropsAndState(this.props, this.state)
    const newAspectRatio = computeRatioFromPropsAndState(nextProps, nextState)

    const result = (
      style?.height !== nextStyle.height ||
      style?.width !== nextStyle.width ||
      source?.uri !== nextSource?.uri ||
      aspectRatio !== newAspectRatio ||
      nextState.error !== error
    )

    // if (result) {
    //   console.log({ aspectRatio, newAspectRatio })
    // }

    return result
  }

  componentDidMount (): void {
    this._componentMounted = true
  }

  componentWillUnmount (): void {
    this._componentMounted = false
  }

  handledLoaded = evt => {
    const { autoHeight, maxRatio, minRatio, onLoad = null } = this.props
    const { aspectRatio = 0 } = this.state

    if (autoHeight && !aspectRatio) {
      const { width, height } = evt?.nativeEvent?.source

      if (this._componentMounted && width && height) {
        const newAspectRatio = Math.max(Math.min(width / height, maxRatio), minRatio)

        this.setState({ aspectRatio: newAspectRatio })
      }
    } else if (onLoad) {
      onLoad(evt)
    }
  }

  handledError = e => {
    const { onError = null } = this.props

    this.setState({ error: true })

    if (onError) {
      onError(e)
    }
  }

  captureRef = e => {
    this._root = e
  }

  render () {
    const {
      source,
      onProgress,
      onErrorRender,
      children, fallback,
      autoHeight, style = {},
      themeStyle, imageStyle,
      onLoad, onLoadEnd, onLoadStart,
      ...props
    } = this.props

    const { error } = this.state

    if (error && onErrorRender) {
      return onErrorRender()
    }

    const isEmpty = source.uri !== undefined
      && String(source.uri) == ''

    if (isEmpty) {
      return (
        <View
          ref={ this.captureRef }
          style={[ styles.imageContainer, themeStyle, style ]}
        >
          { children }
        </View>
      )
    }

    return (
      <View
        ref={ this.captureRef }
        style={[ styles.imageContainer, themeStyle, style, this.computedRatioStyle ]}
      >
        <Image
          { ...props }
          onLoadEnd={ onLoadEnd }
          onProgress={ onProgress }
          onLoadStart={ onLoadStart }
          onError={ this.handledError }
          onLoad={ this.handledLoaded }
          source={ this.resovledResource }
          style={[ styles.image, imageStyle ]}
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
    low: 'low',
    normal: 'normal',
    high: 'high'
  }

  static prefetch = sources => {
    Image.prefetch(sources)
  }

  static defaultProps = {
    ...ImageDefaultProps,
    themeStyle: { backgroundColor: '#DCDCDC' },
    imageStyle: {}
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: '#DCDCDC',
    overflow: 'hidden'
  },
  image: { ...StyleSheet.absoluteFill }
})
