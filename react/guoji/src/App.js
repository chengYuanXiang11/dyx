import './App.css';
import {useState} from 'react'
import { IntlProvider } from 'react-intl'
import zhTW from './locales/zh-TW'
import enUs from './locales/en_US'
import Layout from './Layout'
function App() {
  const [res,changres]=useState("zhTW")
  const handleMessage = lang=>{
    switch (lang) {
      case "zhTW":
        return zhTW;
      case "enUS":
        return enUs;
      default:
        return zhTW;
    }
  }
  return (
    <div className="App">
      
      <IntlProvider
          locale={"en"}
          messages={handleMessage(res)}
        >
          <button onClick={()=>{changres("zhTW")}}>中文</button>
          <button onClick={()=>{changres("enUS")}}>英文</button>

            <Layout>
            </Layout>
        </IntlProvider>
        </div>
  );
}

export default App;
