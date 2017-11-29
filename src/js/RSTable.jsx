import React from 'react';
import '../index.css';

import {getFuncColor} from './helper.js'

export class RSTable extends React.Component {

  constructor() {
    super();

    this.state = { data: this.getData() };
  }

  getData() {
    return [
      {
        name: "Load/Store 1",
        steps: ["LW", "SW", "SW", "", "", "", "LW", "SW", "SW", "", "", "LW", "", "SW", "SW", "", "", "", "", ""]
      },
      {
        name: "Load/Store 2",
        steps: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
      },
      {
        name: "Load/Store 3",
        steps: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
      },
      {
        name: "INT 1",
        steps: ["ADDIU", "ADDIU", "", "", "BNE", "", "", "ADDIU", "ADDIU", "", "BNE", "", "", "ADDIU", "ADDIU", "BNE", "", "", "", ""]
      },
      {
        name: "INT 2",
        steps: ["", "ADDIU", "ADDIU", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
      },
      {
        name: "INT 3",
        steps: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
      }
    ];
  }

  render() {
    const data = this.state.data;

    return (
      <table className='rs-table'>
        <thead>
          <tr>
            <th>Reservation Station</th>
            <th colSpan={data[0].steps.length}>Steps</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => {
            return (
              <tr key={i}>
                <td width={60}>{item.name}</td>
                { item.steps.map((item, i) => {
                  return <td key={i} width={25} className={getFuncColor(item)}>{item}</td>
                }) }
              </tr>
            )
          })}
        </tbody>
      </table>
    )

  }

}