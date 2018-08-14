import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';



class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      current: 0
    };
  }

  componentDidMount() {
    this.onClickSearch2();
    setInterval(this.onClickSearch2.bind(this), 60 * 1000);

    /*
    setInterval(function() {
      //this.onClickSearch2();
      var date = new Date(Date.now()).toLocaleString();
      console.log(date);
    }, 10 * 1000);
    */
  }

  onClickSearch2() {

    var valorDisponivel = 100;
    var telegramMyChatId = '176061450';
    var telegramToken = 'bot657599997:AAEzL8bf5NWEr67Yh7aTeNi8W-vbImTEBtE';


    axios.get('https://api.bitcointrade.com.br/v1/public/BTC/ticker')
      .then(response => {


        var order = {
          "currency": "BTC",
          "amount": valorDisponivel / response.last,
          "type": "buy",
          "subtype": "limited",
          "unit_price": response.data.last
        };

        console.log('ticker', response.data);

        var last = response.data.data.last;

        if (this.state.current <= 0)
          this.setState({ current: last });


        var date = new Date(Date.now()).toLocaleString();
        var variation = (1-(this.state.current/last))*100;

        var text = 'Date: '+ date + ' | Current: R$'+ this.state.current + ' | Last: R$'+ last + ' | Var: '+ variation +'%'; 

        this.setState({ current: last });

        console.log('text', text);

        /*
        axios.get('https://api.telegram.org/'+telegramToken+'/getUpdates').then(response2 => {
            console.log('updates', response2.data);
          })
          .catch(exception => {
          });
        */

        
        axios.post('https://api.telegram.org/'+ telegramToken +'/sendMessage?chat_id='+ telegramMyChatId +'&text='+ text, order)
          .then(response3 => {
            console.log('sendMessage');
          })
          .catch(exception => {
            console.log('sendMessage - exception', exception);
          });
        

        /*
        axios.post('https://api.bitcointrade.com.br/v1/market/create_order', order)
          .then(response => {
            response.last
          })
          .catch(exception => {
          });
          */

      })
      .catch(exception => {
      });
  }

  onClickSearch() {
    var stockCodes = [
      "ABEV3", "B3SA3", "BBAS3", "BBDC3", "BBDC4", "BBSE3", "BRAP4", "BRFS3", "BRKM5", "BRML3", "BTOW3",
      "CCRO3", "CIEL3", "CMIG4", "CPFE3", "CPLE6", "CSAN3", "CSNA3", "CVCB3", "CYRE3", "ECOR3", "EGIE3", "ELET3", "ELET6", "EMBR3", "ENBR3", "EQTL3", "ESTC3",
      "FIBR3", "FLRY3", "GGBR4", "GOAU4", "GOLL4", "HYPE3", "IGTA3", "ITSA4", "ITUB4", "JBSS3", "KROT3", "LAME4", "LREN3", "MGLU3", "MRFG3", "MRVE3", "MULT3",
      "NATU3", "PCAR4", "PETR3", "PETR4", "QUAL3", "RADL3", "RAIL3", "RENT3", "SBSP3", "SMLS3", "SUZB3", "TIMP3", "UGPA3", "USIM5", "VALE3", "VIVT4", "WEGE3"
    ]


    var mounth = 9;
    var stockCode = 'BBDC4';
    var optionCode = 'BBDCU260';
    var property = 'Price';

    var date = '2018-0' + mounth + '-01T00:00:00';

    var postData = {
      maturityMonthYear: date,
      orderBy: 2,
      isAscendenting: true,
      showOnlyNegotiatedFilter: true,
      perPage: 1000,
      page: 1,
      StockCode: stockCode
    };

    axios.post('http://www.infomoney.com.br/api/opcoes?hash=cfcd208495d565ef66e7dff9f98764da&ch=5d67750322e9df63be2104829c424242', postData)
      .then(response => {
        var item = null;

        var json = response.data;

        console.log('json', json);

        for (var i = 0; i < json.Options.length; i++) {
          if (json.Options[i].Symbol === optionCode)
            item = json.Options[i];
        }

        console.log('response', item);

        this.setState({ result: item ? (item[property] ? item[property] : '-') : 'erro' });
      })
      .catch(exception => {
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to OPTX</h1>
        </header>
        <p className="App-intro">
          Preço: {this.state.result}
          <div text="search" onClick={this.onClickSearch2}>Click </div>
        </p>
      </div>
    );
  }
}

export default App;