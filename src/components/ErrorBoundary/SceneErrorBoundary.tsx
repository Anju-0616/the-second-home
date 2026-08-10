import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  error: Error | null
}

class SceneErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void text-red-400 font-mono text-sm p-8 text-center">
          Scene failed to load: {this.state.error.message}
        </div>
      )
    }
    return this.props.children
  }
}

export default SceneErrorBoundary