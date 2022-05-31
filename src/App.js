import React, {useState, useEffect} from 'react';
import Header from './components/Header';
import Categories from './components/Categories';
import Sort from './components/Sort';
import PizzaBlock from './components/PizzaBlock';
//import pizzas from './assets/pizzas.json'

import './scss/app.scss';

function App() {
  const [pizzas, setPizzas] = useState([])

  useEffect(() => {
    fetch('https://6295c7a475c34f1f3b20fc53.mockapi.io/items')
    .then(res => res.json())
    .then(json => setPizzas(json))
  }, [])
  

  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <div className="container">
          <div className="content__top">
            <Categories />
            <Sort />
          </div>
          <h2 className="content__title">Все пиццы</h2>
          <div className="content__items">            
            {
              pizzas.map(obj => (
                <PizzaBlock key={obj.id} {...obj}/>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
