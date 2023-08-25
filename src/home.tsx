import * as React from 'react';
import { createRoot } from "react-dom/client";
import { HeaderBar } from './components/HeaderBar';

const Home = (props: {tab: string}) => {
    return (
        <div>Hello World TEST</div>
    );
}

const container = document.getElementById("react-personal-target");
const root = createRoot(container);
root.render(<Home tab = "home"/>);