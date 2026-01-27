import React, { type ReactNode } from "react";
import BackHomeButton from "./components/utils/BackHomeButtom";
interface State {
    hasError:boolean
}
class ErrorBoundary extends React.Component<{fallback:ReactNode, children:ReactNode}> {
    state = {hasError: false}

    static getDerivedStateFromError(error:Error) {
        return {hasError: true}
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.log(error.message)
    }

    errorStyle: React.CSSProperties = {
        color: 'red',
        fontWeight: 'bold',
        fontStyle: 'italic',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        gap:'15px'
    }

    render(): React.ReactNode {
        if (this.state.hasError)
            return (
                <div style={this.errorStyle}>
                    {this.props.fallback}
                    <BackHomeButton/>
                </div>
            )
        else return this.props.children
    }
}

export default ErrorBoundary

