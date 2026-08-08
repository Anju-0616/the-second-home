export interface ScrollState {
  global: number // 0-1 across the entire site
  activeIndex: number // which phase is currently active
  localProgress: number // 0-1 within that phase
}

const scrollStore: ScrollState = {
  global: 0,
  activeIndex: 0,
  localProgress: 0,
}

export default scrollStore