import React, { Component } from "react";
import PoetryList from "../../Components/PoetryList/PoetryList"
import { POETRY_MANAGEMENT } from "../../Components/Menu/menuConstants";
import { Route } from "react-router-dom";

class PoetryManagement extends Component {

    render() {

        return (
            <div>
                <PoetryList />
            </div>
        )
    }

}

export default PoetryManagement;
