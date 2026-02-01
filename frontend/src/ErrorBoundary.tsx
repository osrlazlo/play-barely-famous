import React, { type ReactNode } from "react";
import BackHomeButton from "./components/utils/BackHomeButtom";
interface State {
    hasError:boolean
}
interface ErrorJson {
    status:number
    msg:string
}
class ErrorBoundary extends React.Component<{fallback:ReactNode, children:ReactNode}> {
    state = {
        hasError: false,
        customError: {status:0, msg: ""}
    }
    

    static getDerivedStateFromError(error:Error) {
        return {hasError: true}
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        try {
            let errorJSON = JSON.parse(error.message) as ErrorJson
            this.setState({
                customError: {
                    msg:errorJSON.msg,
                    status:errorJSON.status
                }})
        }
        catch (err) {
            console.log('Failed to parse error message: ', error.message)
        }
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
                    {this.props.fallback} <br/>
                    {`${this.state.customError.status} - ${this.state.customError.msg}`} <br/>
                    {this.state.customError.msg.includes('TypeError') ? 'Likely caused by 429: Too many requests':''}
                    <br/> Please try again later
                    <br/><BackHomeButton/>
                </div>
            )
        else return this.props.children
    }
}

export default ErrorBoundary

