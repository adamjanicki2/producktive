import React from "react";
import logo from "../../logo.svg";
import ReactMarkdown from 'react-markdown'
// import ReactDom from 'react-dom'
import remarkGfm from 'remark-gfm'

const markdown = `
| Difficulty | | Base Coins | | Max Coins | | Min Coins |
| :--- | --- | ---: | --- | ---: | --- | ---: |
| Easy |   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 10 |  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 30 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 1 |
| Medium |  | 20 |  | 60 | | 2 |
| Hard |  | 30 | | 90 | | 3 |

`

const About = () => {
 return (
   <div className="flex flex-column primary-text">
     <h1 className="tc f-subheadline ma0 pa0 ">How it Works</h1>
     <p className="f3 fw3 ph4 mh2">
       Producktive is a productivity app that helps you get more things done.
 
       Create personalized todo lists and fill them with tasks. Complete tasks to earn coins! Coins are
       awarded based on task difficulty and punctuality of completion. Your duck will
       automatically lose 5% health each day, so it's important to boost its health by purchasing food! Coins can also be
       spent in the store to customize your duck's color, visible to all Producktive users!
       <br />
       <br></br>
       <h4>Task Reward System (10% exponential reward/penalty from base for each day before/after deadline until reach max/min coins):</h4>
       
      <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />
       
       <br></br>
       <br />
       Thanks, and happy duck feeding!
       <br />
       <br /> - The Producktive Dev Team
     </p>
     <img src={logo} className="App-logo" alt="Duck" />
   </div>
 );
};
 
 
export default About;
