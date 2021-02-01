import { ViewPropTypes } from 'react-native'

export type ImageProps = {
  ...ViewPropTypes,
  source: { uri: String, headers?: Object, priority?: String },
  onLoadStart?: ()=>void,
  onProgress?: ()=>void,
  onLoad?: ()=>void,
  onError?: ()=>void,
  onErrorRender?: () => void,
  onLoadEnd?: ()=>void,
  fallback?: ()=>void,
  autoHeight?: number,
  maxRatio?: number,
  minRatio?: number,
  aspectRatio?: number
}

export type ImageState = {
  width: number,
  height: number
}

export const ImageDefaultProps = {
  resizeMode: 'cover',
  fadeDuration: 300,
  maxRatio: 16 / 9,
  minRatio: 9 / 16,
  onErrorRender: null,
  themeStyle: {}
}
