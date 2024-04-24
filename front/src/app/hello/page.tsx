'use client'

import Link  from "next/link";


export default function Hello() {
    
    return (
        <>
            <h1>Hello</h1>
            <button type="button" onClick={()=> console.log("test")}> test</button>
        </>
    );
}