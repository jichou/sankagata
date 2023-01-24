import './App.css';
import { useState } from 'react';
import BigNumber from 'bignumber.js';

class Player {
  constructor(id,name,buki,rate) {
    this.id = id;
    this.name = name;
    this.buki = buki;
    this.rate = rate;
  }
}

const App = () => {
  const [paste, setPaste] = useState("イカボーイA\t\t1460.78\nイカガールA\t後衛\t1500.00\nタコボーイA\t\t1615.43\nタコガールA\t\t1500.00\nイカボーイB\t\t1569.02\nイカガールB\t\t1500.00\nタコボーイB\t後衛\t1491.17\nタコガールB\t\t1500.00");
  const [copy, setCopy] = useState("");

  const [alphaPlayers, setAlphaPlayers] = useState([new Player(1, null, null, null)]);
  const [bravoPlayers, setBravoPlayers] = useState([new Player(5, null, null, null)]);

  const [resultAlphaPlayers, setResultAlphaPlayers] = useState([new Player(1, null, null, null)]);
  const [resultBravoPlayers, setResultBravoPlayers] = useState([new Player(5, null, null, null)]);

  function changeCopies() {
    let playerInfoArea = paste.split('\n')
    let playerInfo = playerInfoArea.map(((playerInfo, i) => {
      let player = playerInfo.split('\t');
      return new Player(i, player[0], player[1], player[2]);
    }));

    let alphaPlayersInfo = [
      new Player(0, playerInfo[0].name, playerInfo[0].buki, playerInfo[0].rate),
      new Player(1, playerInfo[1].name, playerInfo[1].buki, playerInfo[1].rate),
      new Player(2, playerInfo[2].name, playerInfo[2].buki, playerInfo[2].rate),
      new Player(3, playerInfo[3].name, playerInfo[3].buki, playerInfo[3].rate)
    ];
    setAlphaPlayers(alphaPlayersInfo);

    let bravoPlayersInfo = [
      new Player(4, playerInfo[4].name, playerInfo[4].buki, playerInfo[4].rate),
      new Player(5, playerInfo[5].name, playerInfo[5].buki, playerInfo[5].rate),
      new Player(6, playerInfo[6].name, playerInfo[6].buki, playerInfo[6].rate),
      new Player(7, playerInfo[7].name, playerInfo[7].buki, playerInfo[7].rate)
    ];
    setBravoPlayers(bravoPlayersInfo);
  };

  function culcRateWhenAlphaWin() {
    culcRate(false);
  }
  function culcRateWhenBravoWin() {
    culcRate(true);
  }
  function culcRate(isBravoWin) {
    BigNumber.config({
      DECIMAL_PLACES: 2,
      ROUNDING_MODE: BigNumber.ROUND_UP
    });
    
    let alphaRateTotal = 0;    
    alphaPlayers.forEach(((x) => {
      alphaRateTotal += (x.rate * 100);
    }));

    let bravoRateTotal = 0;    
    bravoPlayers.forEach(((x) => {
      bravoRateTotal += (x.rate * 100);
    }));

    let incRate = isBravoWin
      ? (2000+(Math.floor((alphaRateTotal-bravoRateTotal)/25)))
      : (2000+(Math.floor((bravoRateTotal-alphaRateTotal)/25)));
    
    let alphaIncRate = isBravoWin
      ? incRate * -1
      : incRate;
      
    let bravoIncRate = isBravoWin
      ? incRate
      : incRate * -1;

    let alphaPlayersInfo = [];
    alphaPlayers.forEach(((x) => {
      let newData = Object.assign({}, x);
      let newRate = newData.rate;
      newData.rate = ((newRate*100)+alphaIncRate)/100;
      alphaPlayersInfo.push(newData);
    }));
    setResultAlphaPlayers(alphaPlayersInfo);
    
    let bravoPlayersInfo = [];
    bravoPlayers.forEach(((x) => {
      let newData = Object.assign({}, x);
      let newRate = newData.rate;
      newData.rate = ((newRate*100)+bravoIncRate)/100;
      bravoPlayersInfo.push(newData);
    }));
    setResultBravoPlayers(bravoPlayersInfo);

    let resultString = "";
    alphaPlayersInfo.forEach(a => {
      resultString += a.name + "\t" + a.buki + "\t" + a.rate + "\n";
    });
    bravoPlayersInfo.forEach(a => {
      resultString += a.name + "\t" + a.buki + "\t" + a.rate + "\n";
    });
    setCopy(resultString);
  };
  return (
    <div className="App">
      <div>
        <p>スプレッドシートから名前・武器・レートの８名分の範囲をそのまま貼り付ける↓</p>
        <div>
          <textarea value={paste} onChange={(e) => setPaste(e.target.value)} />
        </div>
      </div>
      <div>
        <button onClick={changeCopies} key="g"> 貼り付け結果から取得 </button>
      </div>
      <div>
        <p>アルファ</p>
        {alphaPlayers.map((player) => (
            <div key={ player.id }>
                <input type="text" value={ player.name ?? '' } onChange={()=>{}} />
                <input type="text" value={ player.rate ?? '' } onChange={()=>{}} />
            </div>
          ))}
      </div>
      <div>
        <p>ブラボー</p>
        {bravoPlayers.map((player) => (
            <div key={ player.id }>
                <input type="text" value={ player.name ?? '' } onChange={()=>{}} />
                <input type="text" value={ player.rate ?? '' } onChange={()=>{}} />
            </div>
          ))}
      </div>
      <div>
        &nbsp;
      </div>
      <div>
        <button onClick={culcRateWhenAlphaWin} key="a"> アルファが勝利 </button>
        &nbsp;
        <button onClick={culcRateWhenBravoWin} key="b"> ブラボーが勝利 </button>
      </div>
      <div>
        <p>アルファ結果</p>
        {resultAlphaPlayers.map((player) => (
            <div key={ player.id }>
                <input type="text" value={ player.name ?? '' } onChange={()=>{}} />
                <input type="text" value={ player.rate ?? '' } onChange={()=>{}} />
            </div>
          ))}
      </div>
      <div>
        <p>ブラボー結果</p>
        {resultBravoPlayers.map((player) => (
            <div key={ player.id }>
                <input type="text" value={ player.name ?? '' } onChange={()=>{}} />
                <input type="text" value={ player.rate ?? '' } onChange={()=>{}} />
            </div>
          ))}
      </div>
      <div>
        <p>スプレッドシートに雑に持っていけるやつ↓</p>
        <div>
          <textarea value={copy} onChange={(e) => setCopy(e.target.value)} />
        </div>
      </div>
    </div>
  );
}

export default App;
