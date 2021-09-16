import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import QuestionField from "../Component/question-field/QuestionField";

class Page1 extends React.Component {
    render() {
        return (
            <div>
                <QuestionField />
                <Link className="button button1" to="/" style={{ color: 'black' }}>
                    <div>点击跳转到Page0</div>
                </Link>
            </div>
        );
    }
}

export default Page1;