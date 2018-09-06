import React, { Component } from 'react';
import NavBar from '../NavBar/NavBar';
import axios from 'axios';

class NodeMailer extends Component {

    triggerNodeMailer = () => {
        console.log('trigger node mailer button clicked');
        axios.post('/send').then(result => {console.log('node mailer result :', result)}).catch(err=>{console.log('node mailer err: ',err)})
    }

    render() {
        return (
            <main>
                <NavBar />
                <h1>Testing nodeMailer</h1>
                <button onClick={this.triggerNodeMailer}>Trigger Node Mailer</button>
            </main>
        )
    }
}

export default NodeMailer;