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
  autoHeight?: Number,
  maxRatio?: Number,
  minRatio?: Number
}
export type  ImageState = {
  width: Number,
  height: Number
}

export const ImageDefaultProps = {
  resizeMode: 'cover',
  fadeDuration: 300,
  maxRatio: 16 / 9,
  minRatio: 9 / 16,
  onErrorRender: () => null
}
