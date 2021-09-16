import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import Page1 from './Component/Page1';

class App extends React.Component {
    render() {
        return (
            <Router >
                <div className="App">
                    <Route path="/Page1" component={Page1} />
                    <Route exact  path="/" component={Home} />
                </div>
            </Router>
        )
    }
}
export default App;