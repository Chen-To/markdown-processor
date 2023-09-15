import * as React from 'react';
import { createRoot } from "react-dom/client";
import HeaderBar from './components/HeaderBar';
import InputBox from './components/InputBox';

const Home = (props: {tab: string}) => {
    return (
        <>
            <HeaderBar/>
            <InputBox/>
        </>
    );
}

const container = document.getElementById("react-markdown-target");
const root = createRoot(container);
root.render(<Home tab = "home"/>);