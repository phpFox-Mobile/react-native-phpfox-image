import { ViewPropTypes } from 'react-native'

export type ImageProps = {
  ...ViewPropTypes,
  source: { uri: String, headers?: Object, priority?: String },
  onLoadStart?: ()=>void,
  onProgress?: ()=>void,
  onLoad?: ()=>void,
  onError?: ()=>void,
  onLoadEnd: ()=>void,
  fallback: ()=>void,
  autoHeight: Number,
  maxRatio: 1.25,
  minRatio: 0.25
}
export type  ImageState = {
  width: Number,
  height: Number
}
