import React from 'react'
import { Link } from 'react-router-dom';
import BRAILLE from '../Braille/codes.js';

function Dots({code}) {
  return (
    <table className="dots">
      <tbody>
      <tr>
        <td>{code[0]}</td>
        <td>{code[3]}</td>
      </tr>
      <tr>
        <td>{code[1]}</td>
        <td>{code[4]}</td>
      </tr>
      <tr>
        <td>{code[2]}</td>
        <td>{code[5]}</td>
      </tr>
    </tbody>
    </table>
  );
}

function code({ braille, label }) {
  return (
    <div
      key={braille}
      className='braille'
      >
      <Dots code={braille}></Dots>
    <p>{label}</p>
  </div>
  );
}

export default function HomePage() {
  return (
    <div className='container'>
      <h1>Cesar Pachon - Braille Pad</h1>
      <p>
        <Link to='/notes'>Your Notes</Link>
      </p>
      <div style={{display:'flex', flexWrap:'wrap'}}>
      {
        BRAILLE.map((cod) => code(cod))
      }
      </div>
    </div>
  )
}
