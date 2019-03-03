import { ViewPropTypes } from 'react-native'

export type ImageProps = {
  ...ViewPropTypes,
  source: { uri: String, headers?: Object, priority?: String },
  onLoadStart?: ()=>void,
  onProgress?: ()=>void,
  onLoad?: ()=>void,
  onError?: ()=>void,
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
